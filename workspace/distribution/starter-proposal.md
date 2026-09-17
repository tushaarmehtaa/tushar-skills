## Proposed contribution

Would an optional release-preflight document fit this starter? I can contribute a short checklist under `docs/` linked from Going to Production, without adding a runtime dependency or changing the starter defaults.

The checklist would be specific to this repository:

- Record the commit and deployment environment, then run the existing `pnpm build`; distinguish build evidence from unperformed payment/auth smoke checks.
- Review generated Drizzle migrations before applying them to the intended database. Record backup/restore evidence and whether old application code remains compatible after migration. Do not treat an application rollback as a database rollback.
- Verify production environment variable names and provenance without copying secret values into the report.
- Check the production webhook against the actual handler: it currently handles `customer.subscription.updated` and `customer.subscription.deleted`. A successful Stripe CLI delivery alone does not prove subscription state was updated correctly.
- Smoke-test sign-in, access to a team dashboard, and subscription changes in an appropriate test environment. Record what was actually observed and anything still unknown.
- Finish with blockers, responsible owner, and an explicit go/no-go decision. The checklist would not run migrations or deploy automatically.

For agent users, one optional example could invoke a release review and ask for an evidence table. I maintain [Slashskills](https://github.com/tushaarmehtaa/tushar-skills), including an MIT-licensed [deploy-check workflow](https://github.com/tushaarmehtaa/tushar-skills/tree/main/deploy-check). It could be an optional reference; the document would remain usable independently of it.

This is a contribution proposal, not a report that I have tested a production deployment. I inspected the README, package scripts, and Stripe webhook handler. Prepared with AI assistance. Happy to keep this entirely within the starter's own documentation if that is the better fit.
