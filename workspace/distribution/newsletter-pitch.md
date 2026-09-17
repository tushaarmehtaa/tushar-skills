# Editorial pitch — sent

Recipient: Cooperpress editorial, editor@cooperpress.com (https://cooperpress.com/).
Possible publications: Node Weekly or JavaScript Weekly; send one editorial pitch rather than duplicate pitches to both.
Sent from the connected Gmail account. Gmail confirmed SENT. Message ID: 1a0883a9538cf8bb.
Subject: Small Node CLI for checking Agent Skill packages locally

Hi,

I maintain Slashskills, an MIT-licensed collection of Agent Skills. I have released a small Node CLI, slashskills-check, that other skill authors can use on their own packages.

It checks SKILL.md frontmatter, package naming, and bundled Markdown references, with JSON output and nonzero exit codes for failures. It does not run skill instructions or call a model. It is a structural checker, not a security audit or a complete specification validator.

Try it:

npx --yes --package=github:tushaarmehtaa/tushar-skills slashskills-check ./my-skill

Documentation and source:
https://github.com/tushaarmehtaa/tushar-skills/blob/main/docs/skill-check.md

The public GitHub installation was tested, and the repository CI passes. If this fits your developer-tool coverage, I would welcome an editorial look.

Tushar Mehta
Maintainer, Slashskills

## HN status

Not submitted. The current Show HN rules exclude lists and quickly generated one-offs and ask for personally developed work the author is available to discuss. The catalog alone is not a suitable Show HN submission, and this small new utility should gain real use before being positioned as a substantial launch. HN also prohibits generated or AI-edited discussion text, so no AI-written launch comment is supplied.
Sources: https://news.ycombinator.com/showhn.html and https://news.ycombinator.com/newsguidelines.html
