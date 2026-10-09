# Tidepool product notes (internal, synthetic sample)

What it is: shift scheduling for independent veterinary clinics (2-12 vets, 5-40 staff).

The problem we hear: clinic managers build the weekly rota in a spreadsheet, then spend Monday mornings texting people to cover sick calls. Average manager in our onboarding survey (n=38) said 4.5 hours/week on scheduling.

What it does:
- Builds a draft weekly rota from staff availability + each clinic's minimum coverage rules (e.g. "always 1 vet + 2 techs on surgery days").
- When someone calls in sick, texts eligible staff in order of fewest hours that week; first "YES" gets the shift.
- Exports hours to Gusto and ADP (only these two payroll tools today).
- No AI. The rota builder is a constraint solver. Marketing has been calling it "AI-powered"; product would prefer we stop.

Customers: 61 paying clinics in US + Canada as of last month. Median manager time on scheduling after 8 weeks: 1.5 hours/week (self-reported, n=22).
Quote we have permission to use: "Sick calls used to wreck my Monday. Now I find out it's covered when I get in." - Dana R., practice manager, Riverbend Animal Hospital (fictional sample)

Pricing: $6 per staff member per month, billed monthly. 30-day free trial, no card required. Minimum $60/month.
Security: SOC 2 Type I completed; Type II in progress. Do not say "enterprise-grade".
Objections we hear on sales calls: "My staff won't install another app" (answer: shift offers are plain SMS, no app needed); "We already use our PIMS for appointments" (Tidepool doesn't touch appointments).
