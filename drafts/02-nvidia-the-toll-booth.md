# The Toll Booth

## Nvidia Is the Only Company That Actually Won

Every AI lab is racing to build the best model. They all buy their GPUs from the same place.

Nvidia did $215.9 billion in revenue in fiscal 2026. Up 65% in a single year. Gross margins above 74%. OpenAI, Anthropic, Google, Meta — all competitors, all Nvidia customers. Jensen Huang built the one company that profits regardless of who wins.

The numbers are almost absurd. Nvidia earns 49% returns on equity averaged over five years. Return on invested capital is 42%. They generate $60+ billion in free cash flow on $280 billion in assets. Most companies dream of 10% returns on capital. Nvidia delivers 42%.

By April 2026, Nvidia's market capitalization briefly crossed $5 trillion — the first chip company in history to reach that milestone. The hyperscalers — Microsoft, Google, Amazon, Meta — collectively committed $650 billion in AI infrastructure spending for 2026 alone. Nvidia captures a dominant share of that capital flow.

---

## The Three-Layer Moat

The conventional explanation for Nvidia's dominance is the best chip. That is wrong. The chip is table stakes. The moat has three layers, and only one of them is hardware.

**Layer one is CUDA.** Nvidia's proprietary software layer that runs on the chips. Every AI researcher learned to write code in CUDA. Every framework — PyTorch, TensorFlow — is optimized for CUDA. Four million developers know CUDA. Universities teach it. Switching away from Nvidia does not mean buying different hardware. It means rewriting everything.

The switching cost is the point. AMD's MI300 chips can match Nvidia's raw compute in some benchmarks. But matching 15 years of software ecosystem development? OpenAI built ChatGPT on CUDA. Switching to AMD would mean rewriting their entire training infrastructure. Even if AMD chips were 50% cheaper, the switching cost exceeds the savings.

The flywheel: more CUDA developers mean more CUDA-optimized tools, which means more companies hiring CUDA developers, which means more students learning CUDA. This has been spinning for over a decade.

**Layer two is architectural leadership.** Nvidia consistently ships architectures 12-18 months ahead of competitors. The H100 dominated 2023-2024. H200 extended the lead. Blackwell and Vera Rubin are next. The annual refresh cycle is itself a moat — competitors are always chasing the generation Nvidia just replaced.

Vera Rubin, announced at CES 2026, promises five times the performance of Blackwell for inference tasks. Jensen Huang has stated visibility to $1 trillion in cumulative revenue across Blackwell and Vera Rubin through 2027.

**Layer three is supply chain control.** Nvidia has spent fifteen years building a relationship with TSMC that competitors cannot replicate. They command TSMC's advanced CoWoS packaging capacity. Their memory subsystem, tightly integrated with HBM suppliers, consistently outperforms AMD's. During 2023-2024, when H100 demand exceeded supply by 3-4x, Nvidia allocated capacity to preferred customers who committed to multi-year purchase agreements.

---

## Who Is Actually Threatening This

**AMD** has shipped MI300X and MI350X with competitive HBM memory bandwidth. Meta deployed MI300X for inference. ROCm, AMD's CUDA competitor, has improved but remains incomplete for custom kernels.

**Google TPUs** are genuinely competitive for Google's specific workloads. But TPUs are not generally programmable. Workloads must be refactored. External adoption outside Google Cloud is minimal.

**AWS Trainium** and **Microsoft Maia** are in production but address narrow workloads.

**Groq's LPU** achieves 800+ tokens/second inference, but it is a niche player.

Every competitor has a credible entry point. None has the ecosystem. Nvidia owns 70-95% of the AI chip market. The most aggressive credible projections show that share declining slowly, not collapsing.

---

## The Hidden Story

The more everyone tries to dethrone Nvidia, the more resources Nvidia has to stay ahead. Every competitive build-out — AMD's MI300, Google's TPU v5, Amazon's Trainium 2 — requires enormous capital investment. Nvidia uses its incumbent margins to outspend everyone on R&D: $30+ billion annually.

And the hyperscalers are Nvidia's biggest customers AND its most motivated competitors. Microsoft, Google, and Amazon buy more Nvidia hardware than anyone. They are simultaneously trying to build their own alternatives. This creates a strange dynamic where Nvidia's R&D budget is partially funded by its would-be disruptors.

Sovereign AI — governments wanting their own AI infrastructure — is emerging as a new market. Nvidia is deploying AI infrastructure in partnership with governments across France, Germany, Italy, and the UK. National governments operate on different procurement timelines and with different strategic motivations. Nvidia becomes the default partner.

---

## The Business Model Nobody Talks About

If OpenAI or Anthropic ever hit real profitability, Nvidia captures most of the margin anyway. They train on Nvidia hardware. They serve inference on Nvidia hardware. They pay Nvidia prices.

The business model of every AI lab is partially a subsidy to Nvidia. The lab that wins the race still loses to the toll booth.

This is not an accident. It is the hardware layer asserting its structural power over the software layer, the same way Intel dominated the PC era and ARM dominates mobile.

Jensen Huang did not just build the best chip. He built the programming language the entire field thinks in, the supply chain nobody can replicate, and the relationship with the only manufacturer capable of producing at scale. That is not a temporary lead. That is a compound moat that gets harder to break with every passing generation.

The most interesting business story in AI is Nvidia. And almost nobody writes about it as the main character.
