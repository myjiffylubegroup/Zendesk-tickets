import requests
import json
from datetime import datetime, timedelta
import os

# === CONFIGURATION ===
CRED_FILE = r"E:\My Drive\Jiffy Lube Ops Dashboards\Secure-Credentials\zendesk.txt"
ZENDESK_EMAIL = "sporcher@throttlemuscle.com"

def load_token_from_txt(path):
    with open(path, 'r') as f:
        return f.read().strip()

ZENDESK_API_TOKEN = load_token_from_txt(CRED_FILE)
ZENDESK_SUBDOMAIN = "myjiffylube"
BASE_URL = f"https://{ZENDESK_SUBDOMAIN}.zendesk.com/api/v2"
AUTH = (f"{ZENDESK_EMAIL}/token", ZENDESK_API_TOKEN)

# === FUNCTIONS ===
def fetch_all_tickets(status_filter="open"):
    url = f"{BASE_URL}/search.json?query=type:ticket status:{status_filter}"
    tickets = []
    print(f"Fetching tickets with status: {status_filter}")

    while url:
        response = requests.get(url, auth=AUTH)
        if response.status_code != 200:
            raise Exception(f"Zendesk API error: {response.status_code} - {response.text}")

        data = response.json()
        tickets.extend(data.get("results", []))
        url = data.get("next_page")

    print(f"Fetched {len(tickets)} {status_filter} tickets.")
    return tickets

def categorize_ticket(tags, source):
    email = source.get('from', {}).get('address', '').lower()

    if "low-nps" in tags:
        return "low_nps"
    elif "star" in tags:
        return "google_low_rating"
    elif "jli-complaint" in tags or email == "customerservice@jiffylube.com":
        return "jli_complaint"
    else:
        return "other"

def summarize_by_store_and_type(tickets):
    summary = {}

    for ticket in tickets:
        tags = ticket.get("tags", [])
        store = next((tag for tag in tags if tag.startswith("store-")), "not_specified")
        category = categorize_ticket(tags, ticket.get('via', {}).get('source', {}))

        created_at_str = ticket.get("created_at")
        created_at = datetime.strptime(created_at_str, "%Y-%m-%dT%H:%M:%SZ") if created_at_str else None
        age_hours = (datetime.utcnow() - created_at).total_seconds() / 3600 if created_at else 0

        if store not in summary:
            summary[store] = {
                "low_nps": 0,
                "google_low_rating": 0,
                "jli_complaint": 0,
                "other": 0,
                "total": 0,
                "ages": []
            }

        summary[store][category] += 1
        summary[store]["total"] += 1
        summary[store]["ages"].append(age_hours)

    for store in summary:
        ages = summary[store].pop("ages")
        summary[store]["average_age_hours"] = round(sum(ages) / len(ages), 1) if ages else 0

    return summary

# === MAIN ===
if __name__ == "__main__":
    ticket_summary = {}
    overall_summary = {
        "open": {"low_nps": 0, "google_low_rating": 0, "jli_complaint": 0, "other": 0, "total": 0, "average_age_hours": 0},
        "solved": {"low_nps": 0, "google_low_rating": 0, "jli_complaint": 0, "other": 0, "total": 0, "average_age_hours": 0}
    }

    for status in ["open", "solved"]:
        tickets = fetch_all_tickets(status_filter=status)
        summary = summarize_by_store_and_type(tickets)

        total_age = 0
        total_count = 0

        for store, counts in summary.items():
            if store not in ticket_summary:
                ticket_summary[store] = {
                    "open": {"low_nps": 0, "google_low_rating": 0, "jli_complaint": 0, "other": 0, "total": 0, "average_age_hours": 0},
                    "solved": {"low_nps": 0, "google_low_rating": 0, "jli_complaint": 0, "other": 0, "total": 0, "average_age_hours": 0}
                }

            ticket_summary[store][status] = counts

            total_age += counts["average_age_hours"] * counts["total"]
            total_count += counts["total"]

            for key in ["low_nps", "google_low_rating", "jli_complaint", "other", "total"]:
                overall_summary[status][key] += counts[key]

        overall_summary[status]["average_age_hours"] = round(total_age / total_count, 1) if total_count else 0

    ticket_summary["ALL"] = overall_summary

    with open("ticket_store_summary.json", "w") as f:
        json.dump(ticket_summary, f, indent=2)

    print("Dashboard data saved to ticket_store_summary.json")
