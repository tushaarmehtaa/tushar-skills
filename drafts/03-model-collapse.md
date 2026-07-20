# The Data Wall

## When AI Trains on Itself

By April 2025, 74.2% of newly created webpages contained some AI-generated text. The internet is filling up with machine output.

This is not a curiosity. It is a problem for the next generation of models. Frontier models are trained on the internet. The internet is increasingly full of text written by the models that came before. If you follow the chain far enough, it becomes a feedback loop.

The term for what happens next is model collapse.

---

## What Model Collapse Actually Is

In July 2024, Ilia Shumailov and his colleagues at Google DeepMind published a paper in Nature showing that models degrade when successive generations train on content produced by earlier models. The mechanism is not mysterious. It is mathematically inevitable.

The process has three layers of error:

Statistical approximation error. A finite sample of data never captures the full distribution. Rare patterns are underrepresented. With each generation, the tails of the distribution get thinner.

Functional expressivity error. The model class — however large — cannot represent the true distribution perfectly. The gap between what is real and what the model can represent compounds.

Functional approximation error. The learning procedure itself introduces bias. Training prioritizes certain patterns over others.

Compound these across generations and the result is unambiguous: rare events vanish first. Outputs converge toward bland averages. The weird, surprising, specific stuff in human writing — that is what gets erased first.

Within five generations of recursive training, measurable degradation appears across text, code, and image generation. We do not know which generation the current frontier models are on because labs do not disclose training data composition.

---

## The Mathematical Proof

Dohmatob et al. studied an analytically tractable version of this problem. A sequence of linear models, each trained on the predictions of the previous model. The test error increases linearly with the number of iterations when data is replaced each generation.

The key insight: this happens not because the models are bad, but because each generation inherits the blind spots of the one before it. The model's view of reality narrows. Outputs drift toward central tendencies. The distribution shrinks like a photograph of a photograph of a photograph.

The Nature paper distinguishes early collapse — tails of the distribution disappear — from late collapse — the model converges to a shrunken distribution with very low variance.

---

## The Mitigation That Might Not Be Enough

There is a debate about how bad this will be in practice.

One camp argues that model collapse requires unrealistic conditions — training exclusively on synthetic data with no human data mixed in. In the real world, data accumulates rather than being replaced. If you keep adding fresh human data, the degradation is bounded.

A 2024 paper by researchers at Cambridge and Oxford showed that when data accumulates (rather than being replaced), model collapse can be avoided. The test error has a finite upper bound independent of the number of iterations.

But this assumes human data continues to be produced at the same rate. And it ignores the inter-model problem.

---

## The Inter-Model Version

The most recent research adds a critical wrinkle: future models trained on internet-sourced content will be trained on outputs from other generative AI models, not merely their own. Already, the internet is filled with content from various models.

This means the problem is not self-consumption. It is multi-model pollution. Model A generates text that Model B trains on. Model B generates text that Model C trains on. The data on the internet has no single parent. It is a soup of outputs from every model that has ever been deployed.

A 2025 paper provides empirical evidence that this is already happening. Whitepapers for frontier models published after 2023 do not contain specific training data information — likely due to pending litigation — but the language suggests collection of additional online data at each update. And that online data increasingly contains outputs from other models.

---

## The Mitigations That Exist

Some approaches work at the technical level:

ForTIFAI introduces a Truncated-Cross-Entropy loss function that selectively ignores high-confidence tokens during training. This filters out likely machine-generated artifacts. Models trained with TCE tolerate over 2.3x more synthetic data before collapse onset.

Verifier-guided retraining uses an external verifier — a human or better model — to filter synthetic data. This works in the short term but drives the parameter estimate toward the verifier's "knowledge center" in the long run. Unless the verifier is perfectly reliable, early gains plateau and may reverse.

Data accumulation — keeping all prior human data — sets a hard upper bound on degradation.

---

## The Practical Risk

The labs racing to produce the most AI-generated content — for products, for synthetic training data, for data augmentation — are potentially poisoning the well they drink from.

The irony is structural. The same companies that need the most high-quality training data are producing the most low-quality AI-generated content. They are flooding the internet with synthetic text, and then they will scrape that same internet to train the next generation of models.

Nobody knows how close we are to the threshold. The labs do not disclose training data composition. The debate is about how fast and how bad, not whether.

What is known: 74.2% of new webpages contain AI text. The models training on that data will be trained on each other's outputs. And the mathematical guarantee is that rare patterns disappear first.

The weird, surprising, specific things that make human writing worth reading — those are the first things to go.
