# LongHorizonBench — SPEC

**Working Title:** LongHorizonBench  
**Inspiration:** pinchbench/skill (mechanics), LOCA-bench (compaction measurement), GAIA (real-world difficulty), ToolComp (multi-step tool chains)  
**Goal:** Benchmark AI agents as the brain of Hermes-Agent — test 10–50+ sequential tool calls across the full Hermes capability surface, compaction survival, research-before-implementation, and cross-domain skill chaining  
**Note:** This is a TASK FRAMEWORK only — not a benchmarking submission service. The goal is to have a runnable task suite that makes it trivial to swap in different models and compare them as potential Hermes brains.  

---

## 1. WHY THIS BENCHMARK EXISTS

Current agent benchmarks have a ceiling of 3–6 tool calls per task. Real ML engineering problems demand 15–50+ steps across research, implementation, debugging, and evaluation. No benchmark tests:

- **Chain depth**: Can the agent execute 30 steps without drifting from the goal?
- **Compaction survival**: After the context window compresses mid-task, can it recover and continue?
- **Research-first**: Does the agent investigate before acting, or just guess?
- **LLM-domain expertise**: Inference serving, quantization, RL, serving infrastructure — these require deep technical judgment

---

## 2. DESIGN PRINCIPLES

1. **Real ML/LLM engineering tasks** — not calendar/email proxies. Tasks come from actual workflows: deploying vLLM, quantizing models, tuning GRPO rewards, debugging CUDA OOMs.
2. **Measured compaction events** — inject synthetic compaction at defined step thresholds (step 10, 20, 30) and verify the agent recovers correctly.
3. **Research is graded** — agent must document its research steps (what it read, what it tried) before implementing. Bad research → bad implementation even if code "runs."
4. **Tool call counting + success rate** — both matter. An agent that makes 50 calls and fails is worse than one that makes 15 and succeeds.
5. **Multi-session with compaction** — simulate real workflows where you return to a task after context has been compacted.

---

## 3. CATEGORIES & TASKS

Hermes spans 18 skill categories. Tasks map to these domains, testing agents on real-world combinations that cross skill boundaries — because that's how Hermes gets used in practice.

### Category A: ML/LLM Engineering (5 tasks)
Inference serving, quantization, RL fine-tuning — the core ML workflows.

### Category B: Research & Synthesis (3 tasks)
Multi-source web research, arxiv reading, Context7 doc retrieval — research-first tasks where wrong sources mean wrong implementation.

### Category C: DevOps & Infrastructure (3 tasks)
Docker, RunPod, webhooks, cron, MCP servers — ops tasks that require planning and cross-service coordination.

### Category D: Productivity & Data (3 tasks)
Email, Notion, Obsidian, Linear, GitHub — information management and cross-platform coordination.

### Category E: Creative & Media (2 tasks)
Architecture diagrams, Excalidraw, p5js, music generation — creative tool chaining.

### Category F: Cross-Domain Chaining (4 tasks)
Tasks that require mixing skills from multiple categories — the hardest and most realistic scenarios.

---

### Category A: ML/LLM Engineering (5 tasks)
Inference serving, quantization, RL fine-tuning — the core ML workflows Hermes ships with skills for.

**A1 — Deploy vLLM with Tensor Parallelism and KV Cache Tuning**
- Deploy Qwen3.5-9B with tensor_parallel=2 on A5000
- Experiment with gpu-memory-utilization, max-model-len, enable-prefix-caching
- Inject compaction at step 12 (context summary after research phase completes)
- Grading: Server runs + throughput documented + tuning decisions explained in workspace/README.md
- Tool call estimate: 15–25

**A2 — SGLang + FlashInfer Benchmark on RTX 3060**
- Serve Qwen3.5-9B via SGLang on local RTX 3060 12GB
- Benchmark FlashInfer vs eager attention backend at 3 sequence lengths
- Inject compaction mid-benchmark
- Grading: Benchmark table populated + correct backend recommendation with justification
- Tool call estimate: 12–20

**A3 — Debug a Crashed vLLM Server from Error Logs**
- Given a config file and error log (CUDA OOM), diagnose root cause
- Must read vLLM error docs before fixing
- Grading: Diagnosis matches actual root cause + fix applied + server restarts
- Tool call estimate: 10–18

**A4 — AWQ Quantization of Qwen3.5-9B with Accuracy Comparison**
- Run AWQ calibration at 3 dataset sizes (128, 512, 1024 samples)
- Compare 2 group sizes (64 vs 128) and save quantized weights
- Evaluate with lm-evaluation-harness on MMLU + HellaSwag
- Grading: Perplexity table in workspace + accuracy within 4% of BF16 baseline
- Tool call estimate: 20–35

**A5 — GRPO Training Setup on GSM8K**
- Configure GRPO with custom accuracy + format reward
- Train 1.5B model for 50 steps
- Evaluate before/after against GSM8K
- Grading: Training completes + eval improvement documented + final config saved
- Tool call estimate: 18–30

---

### Category B: Research & Synthesis (3 tasks)
Multi-source web research, arxiv, Context7 — tasks where the agent must investigate before acting, and wrong sources mean wrong outcomes.

**B1 — Research and Deploy a Model on RunPod from Scratch**
- Agent must research: which RunPod GPU fits the model, which SDK to use, pricing
- Then actually deploy it and verify it works
- No instructions given upfront — agent must find the docs
- Grading: Running endpoint + research documented in workspace/RESEARCH.md
- Tool call estimate: 15–25

**B2 — arxiv Paper Research and Implementation**
- Given a paper topic (e.g., "Speculative Decoding"), read 2-3 arxiv papers
- Write a 500-word summary + implementation notes
- No web search for summaries — must read the actual papers
- Grading: LLM judge evaluates summary accuracy + implementation feasibility
- Tool call estimate: 8–15

**B3 — Multi-Source Technical Research with Citation Tracking**
- Research a technical question (e.g., "AWQ vs GPTQ for MoE models")
- Must gather from 3+ distinct sources: arxiv, GitHub issues, blog posts, Context7
- Synthesize into a recommendation with citations
- Grading: Research quality (LLM judge) + citations verified + recommendation justified
- Tool call estimate: 12–20

---

### Category C: DevOps & Infrastructure (3 tasks)
Docker, RunPod, webhooks, cron, MCP — ops tasks that require planning across services and handling failures gracefully.

**C1 — Dockerize an Existing Model Serving Setup**
- Given a bare Python script that runs a model, create a production Docker setup
- Must handle: GPU access, model downloading, health checks, graceful shutdown
- Inject compaction after Dockerfile is written (agent must remember the plan)
- Grading: Docker image builds + runs + responds to health check
- Tool call estimate: 12–20

**C2 — Set Up a Webhook Pipeline with Cron and Notification**
- Set up a cron job that runs a script daily, posts results to a webhook
- Must handle: webhook auth, retry logic, cron timezone, error alerting
- Grading: Cron runs + webhook receives correct payload + error path tested
- Tool call estimate: 10–18

**C3 — MCP Server Discovery and Tool Integration**
- Given a task that requires a tool not currently available, find and configure an MCP server
- Must research available MCP servers, configure auth, verify tools are registered
- Grading: Tools appear in tool list + return valid results
- Tool call estimate: 10–16

---

### Category D: Productivity & Data (3 tasks)
Email, Notion, Obsidian, Linear, GitHub — information management and cross-platform workflows.

**D1 — Cross-Platform Research to Document Pipeline**
- Research a topic via web, save findings to Obsidian note
- Create a Linear issue for follow-up work
- Email a summary to a recipient
- Grading: Obsidian note exists + Linear issue created + email sent (all verified)
- Tool call estimate: 10–18

**D2 — GitHub Issue Triage and Project Management**
- Given 10 GitHub issues, triage them: label, assign priority, close duplicates
- Create Linear issues for the valid ones
- Grading: Correct triaging + Linear issues match GitHub issues
- Tool call estimate: 12–20

**D3 — Notion Database Sync with External Data**
- Pull data from a web source, populate a Notion database
- Handle: auth, rate limiting, schema mapping, error rows
- Grading: Notion database populated + rows match source data
- Tool call estimate: 10–18

---

### Category E: Creative & Media (2 tasks)
Architecture diagrams, Excalidraw, p5js, music generation — creative tool chaining with iteration.

**E1 — Architecture Diagram with Iterative Refinement**
- Generate an architecture diagram from a description
- Iteratively refine based on LLM judge feedback (3 rounds)
- Each round: generate → judge feedback → revise
- Grading: Final diagram matches requirements + 3 revision rounds completed
- Tool call estimate: 8–15

**E2 — Multi-Step Creative Pipeline**
- Research a music generation topic (HeartMuLa)
- Generate a song with specific parameters
- Create a spectrogram visualization (songsee)
- Produce an architecture diagram of the pipeline
- Grading: All 3 outputs exist + pipeline is documented
- Tool call estimate: 10–20

---

### Category F: Cross-Domain Chaining (4 tasks)
The hardest tasks — mixing skills from multiple Hermes domains in a single coherent workflow.

**F1 — Full ML Pipeline: Research → Deploy → Benchmark → Report**
- Research which model fits the use case
- Quantize and deploy to RunPod
- Benchmark against baseline
- Write report in Notion
- Grading: All stages complete + Notion report with numbers + research citations
- Tool call estimate: 25–45

**F2 — Reproduce a GitHub Bug, Fix It, and Publish the Fix**
- Given a GitHub issue, reproduce the bug
- Research the fix across docs and issues
- Apply fix and verify
- Grading: Bug reproduced + fix applied + PR opened with explanation
- Tool call estimate: 15–30

**F3 — VA Management Workflow (Hermes-native use case)**
- Review VA task results from WhatsApp DMs
- Triage completed work, identify failures
- Create follow-up tasks in Linear
- Send corrective feedback via WhatsApp
- Grading: VA tasks reviewed + Linear tasks correct + WhatsApp messages sent
- Tool call estimate: 12–22

**F4 — Complex Research + Creative + Infrastructure Task**
- Research a technical topic across 3+ sources
- Generate a creative visualization of the concept
- Deploy a demo serving the visualization
- Grading: Research sound + visualization accurate + deployment live
- Tool call estimate: 20–40

---

## 4. TASK FORMAT

Same mechanics as pinchbench/skill, extended with new frontmatter fields.

```yaml
---
id: task_a1_vllm_multigpu
name: Multi-GPU vLLM Deployment
category: inference_serving
grading_type: hybrid       # most tasks are hybrid
timeout_seconds: 600       # long-horizon tasks need more time
tool_call_budget: 50       # NEW: max tool calls before considered "lost"
compaction_events:         # NEW: inject compaction at these step thresholds
  - step: 10
    type: summary
    inject_after: 5        # after 5 tool calls, compact
  - step: 25
    type: full_compact
research_required: true    # NEW: agent must document research steps
workspace_files:
  - source: "broken_config.yaml"
    dest: "vllm_config.yaml"
sessions:
  - id: research_and_plan
    prompt: |
      Research the vLLM tensor parallelism documentation, then propose a deployment plan.
  - id: implement
    new_session: true
    prompt: |
      Execute the plan you documented in the previous session. The context has been compacted.
---
```

### New Frontmatter Fields

| Field | Type | Purpose |
|-------|------|---------|
| `tool_call_budget` | int | Max tool calls allowed. Exceeding = automatic partial fail |
| `compaction_events` | list | Steps at which to inject synthetic compaction |
| `research_required` | bool | If true, grading checks for documented research steps in transcript |
| `expected_tool_count` | int | Hint for grading — was the agent thorough enough? |

---

## 5. GRADING

### Automated Checks

Standard pinchbench `grade(transcript, workspace)` function, extended with:

```python
def grade(transcript: list, workspace_path: str) -> dict:
    scores = {}

    # Tool call counting
    tool_calls = [m for m in transcript if m["type"] == "message"
                  and m["message"]["role"] == "assistant"
                  and "toolCall" in m["message"]["content"]]
    scores["tool_efficiency"] = 1.0 if len(tool_calls) <= task.tool_call_budget else 0.5

    # Research step verification (if research_required)
    if task.research_required:
        research_steps = extract_research_steps(transcript)
        scores["research_quality"] = min(1.0, len(research_steps) / 5)  # want 5+ docs read

    # Compaction recovery
    if task.compaction_events:
        pre_compaction = get_output_before_compaction(transcript)
        post_compaction = get_output_after_compaction(transcript)
        scores["compaction_recovery"] = 1.0 if consistent(pre_compaction, post_compaction) else 0.0

    # Standard file/content checks
    scores["task_success"] = check_workspace_outputs(workspace_path)
    return scores
```

### Compaction Recovery (Core Metric)

Compaction is the central long-horizon test. The question is not "did the agent continue after compaction" — it's "did the agent maintain coherent task state and know where it was?"

**Injection mechanism:**
At the configured step threshold, the agent receives a synthetic "compaction event" message injected as a tool result:

```
[COMPACTION EVENT] Context has been summarized. Your task state:

Goal: <task goal>
Completed steps:
  1. <step 1 summary>
  2. <step 2 summary>
  ...
Pending steps:
  - <remaining high-level steps>

Key artifacts created:
  - <file paths if any>
  - <decisions made>

Resume from where you left off. Do NOT restart the task.
```

**Grading compaction survival:**
- Pre-compaction state must be recoverable from the injected summary
- Post-compaction behavior must be consistent with pre-compaction decisions
- LLM judge evaluates: did agent know its location in the task? Did it contradict earlier decisions? Did it restart unnecessarily?

**Compaction failure modes (from LOCA-bench data):**
- "Impatience" — stops after first result, assumes task is complete
- Contradiction — makes opposite decisions post-compaction
- Restart — abandons progress and starts over
- Hallucination drift — retrieves correct data but distorts values in output

---

## 6. METRICS

| Metric | What it measures |
|--------|-----------------|
| **Task Success Rate** | % of tasks completed (all grading criteria pass) |
| **Tool Efficiency** | Actual calls vs. tool_call_budget — did agent waste calls? |
| **Chain Depth** | Max tool calls in a single task before success/failure |
| **Compaction Recovery Rate** | % of compaction events where agent continued correctly |
| **Research Quality** | For research_required tasks: docs read, citations, plan quality |
| **Time per Task** | Wall clock time (for speed vs. quality tradeoff analysis) |
| **Step Count at Failure** | Where do agents fail — early (planning) vs. late (evaluation)? |

---

## 7. ARCHITECTURE

Minimal — fork pinchbench/skill structure and extend. The goal is swappable model runners, not a new framework.

```
LongHorizonBench/
├── benchmark.py              # Fork of pinchbench benchmark.py
├── lib_grading.py            # + compaction survival checks, research quality
├── lib_agent.py              # + compaction injection at step thresholds
├── tasks/                    # Task .md files (fork pinchbench structure)
│   ├── category_a_ml_llm/    # A1–A5
│   ├── category_b_research/  # B1–B3
│   ├── category_c_devops/    # C1–C3
│   ├── category_d_productivity/  # D1–D3
│   ├── category_e_creative/ # E1–E2
│   └── category_f_crossdomain/   # F1–F4
├── assets/                   # Fixture files per task
└── results/                  # JSONL output per run
```

**Fork strategy:** Start from pinchbench/skill as a base. The task format is the same, the runner is adapted, and new task files are added. The compaction injection lives in `lib_agent.py` as a pre-tool-result hook.

---

## 8. KEY DIFFERENCES FROM PINCHBENCH

| Aspect | PinchBench | LongHorizonBench |
|--------|-----------|-----------------|
| Tool calls per task | 1–5 | 10–50 |
| Compaction | Not tested | First-class — survival + state coherence |
| Research-first tasks | No | Yes, LLM-judged |
| Domain focus | General productivity | Full Hermes capability surface |
| Grading | Outcome only | Outcome + process (compaction survival, research quality) |
| Tool call budget | No | Yes (efficiency scoring) |
| Swappable models | Yes | Yes — same runner, different model = different Hermes brain |

---

## 9. INSPIRATION SOURCES

- **LOCA-bench** (arXiv:2602.07962) — context growth scaling, context rot measurement
- **llm-compaction-benchmark** (va2ai/llm-compaction-benchmark) — compaction quality evaluation
- **ToolComp** (Scale Labs) — multi-step tool reasoning with per-step supervision
- **GAIA** (ICLR 2024) — "simple for humans, hard for AI" real-world difficulty
- **TheAgentCompany** (ICML 2025) — real-world workplace task completion
- **τ-bench** — customer service multi-turn tool-dialogue
- **SWE-bench** — code bug reproduction and fixing

---

## 10. DECISIONS MADE

1. **Compaction injection**: Hard step count — predictable, reproducible, easier to debug
2. **Research quality**: LLM-judged — counts alone don't measure "right docs read"
3. **Hardware mode**: Planning-only mode NOT included — all tasks require real execution
4. **First model to run**: Qwen3.5-9B via vLLM on local RTX 3060 (your existing setup)
5. **Leaderboard**: None — local results only, model comparison is a local concern
