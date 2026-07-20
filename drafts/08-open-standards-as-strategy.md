# Give Away the Foundation, Own the Future

## How Open Standards Became the Best Competitive Move in AI

In November 2024, Anthropic open-sourced a protocol for connecting AI models to external tools. It was called the Model Context Protocol. MCP.

Within twelve months, OpenAI adopted it. Google adopted it. Microsoft adopted it. Cursor, VS Code, and GitHub Copilot all adopted it. By December 2025, Anthropic donated MCP to the Linux Foundation. There are now over 10,000 public MCP servers.

The standard outlived the steward within a year.

This was not an accident. It was a strategy. And Anthropic is not the first to run it.

---

## The Playbook

The pattern has three stages.

First, identify a universal coordination problem. Something every developer in the ecosystem faces individually, making every integration a custom build.

Second, build a solution and give it away. Open source. No licensing. No proprietary lock-in at the protocol layer.

Third, let the ecosystem do the rest. Adoption drives standardization. Standardization drives dependency. Dependency drives structural relevance.

Before MCP, connecting AI models to external systems required custom integration for every combination of model and tool. Ten AI applications and one hundred tools meant one thousand potential integrations. MCP collapses that: each model implements the client once, each tool implements the server once. M+N instead of MxN.

The same logic that made USB universal for hardware peripherals. One connector, infinite compatibility.

---

## Anthropic's Bet

MCP is not the first time this playbook has been run, and it may not be the most important. But it is the clearest recent example.

The bet is not that Anthropic will monetize the protocol directly. The bet is that an AI world built on MCP is a world where Anthropic is structurally relevant regardless of which model wins.

If MCP becomes how every AI model connects to every external tool, then Anthropic is not just a model provider. They are the USB port. Everything plugs into the standard they defined. The ecosystem grows around the protocol, not around any single product.

The same logic applies to Agent Skills. In October 2025, Anthropic introduced a format for packaging reusable AI capabilities as portable files. By December 2025, it was open-standardized at agentskills.io. OpenAI adopted it in Codex. They deprecated their own competing system to do it. Gemini CLI and GitHub Copilot followed.

This is the pattern: define the standard, give it away, watch competitors adopt it. The company that defined it wins something more durable than market share. They win gravity.

---

## OpenAI's Earlier Version

OpenAI ran the same playbook in June 2023 with function calling — a structured way for models to invoke external tools using JSON. The format was so clean and obvious that every other LLM provider copied it within months. Anthropic, Google, Mistral — all of them.

The same thing happened with the OpenAI API message shape. The {role: "user" / "assistant" / "system", content: "..."} format became the standard interface for interacting with LLMs. Almost every competing provider mirrors it. Developers do not need to re-learn anything when they switch providers.

The result: OpenAI's mental model of how AI tools work became the industry's mental model. The pattern was so deeply embedded that even developers who had never touched an OpenAI product learned to think about tool use the way OpenAI defined it.

And then there is Gym. OpenAI released it in 2016 — a standard toolkit for building reinforcement learning environments. The API became the universal interface every RL researcher used for the next decade. OpenAI stopped maintaining it. The community forked it as Gymnasium and kept going. The standard outlived the stewards.

---

## What "Owning the Standard" Actually Means

It is not a trophy. It is structural advantage.

When you define the standard, you have the deepest understanding of it. You employ the people who built it. You set the roadmap. When the standard evolves, your fingerprints are on every decision. Competitors who adopted your standard are building on your foundation. They are contributing back to something you steered into existence.

Kubernetes is maintained by the Cloud Native Computing Foundation, technically vendor-neutral. But Google engineers are its most active contributors. The project reflects their architectural instincts. Competitors running Kubernetes are running Google's thinking.

MCP is twelve months old and already the default assumption for anyone building AI integrations. Anthropic did not win because they had the best model or the most users. They won because they shipped a protocol that solved a real coordination problem, made it free, and let the ecosystem do the rest.

---

## The Closing Window

The playbook works only when the problem is universal and the solution is non-obvious. The more mature the industry becomes, the harder it is to define the next standard. The low-hanging protocol-layer problems have been taken.

Companies are increasingly aware of the pattern and may resist adopting a competitor's standard. OpenAI initially resisted MCP before ultimately adopting it — a sign that the strategic calculus around standards is shifting.

But the window is not closed. The agent ecosystem is still early. Standards for agent-to-agent communication, tool governance, and safety protocols remain undefined. Whoever defines them will own gravity for the next cycle.

---

## The Playbook in One Line

The companies that define the next decade are not hoarding breakthroughs. They are open-sourcing the infrastructure layer and competing on the product layer above it.

Give away the foundation. Own the future.

It is the most counterintuitive thing in tech: the fastest way to dominate an industry is to give the industry your best work. The companies that figured this out earliest are the ones still setting the terms.
