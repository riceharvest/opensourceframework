# LongHorizonBench — SPEC

**Working Title:** LongHorizonBench  
**Inspiration:** pinchbench/skill (mechanics), LOCA-bench (compaction measurement), GAIA (real-world difficulty), ToolComp (multi-step tool chains)  
**Goal:** Benchmark AI agents on 10–50+ sequential tool calls, compaction survival, research-before-implementation, and deep ML/LLM domain knowledge  

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

### Category A: Inference Serving (5 tasks)

**A1 — Multi-GPU vLLM Deployment with KV Cache Tuning**
- Deploy Qwen3.5-9B with tensor parallelism on 2× A5000
- Experiment with `--gpu-memory-utilization`, `--max-model-len`, `--enable-prefix-caching`
- Inject compaction at step 10 (simulate context summary after research phase)
- Grading: Server runs + throughput baseline met + tuning decisions documented

**A2 — SGLang + FlashInfer Benchmark on RTX 3060**
- Get SGLang serving Qwen3.5-9B on local RTX 3060 12GB
- Benchmark FlashInfer vs eager attention backend
- Inject compaction mid-benchmark
- Grading: Correct backend selected + benchmark results in table format

**A3 — Debug a Crashed vLLM Server (CUDA OOM)**
- Reproduce a CUDA out-of-memory crash given a config and error log
- Agent must research the cause, identify the offending `--max-model-len` setting, fix it, and restart
- Requires reading vLLM error docs and forum posts
- Grading: Correct diagnosis + fix applied + server restarts successfully

**A4 — Multi-Node Ray Cluster Setup for vLLM**
- 2-node Ray cluster with NCCL networking
- Deploy 70B model across nodes with pipeline parallelism
- Grading: NCCL connectivity test passes + model generates valid output

**A5 — Prefix Caching Analysis and Optimization**
- Analyze vLLM prefix caching hit rates for a given workload
- Tune chunked prefill settings to improve cache hit rate
- Grading: Cache hit rate improvement quantified

---

### Category B: Quantization (5 tasks)

**B1 — AWQ Quantization of Qwen3.5-9B with Accuracy Evaluation**
- Run AWQ calibration (128, 512, 1024 calibration samples)
- Compare group sizes: 64 vs 128 vs 256
- Evaluate against BF16 baseline on MMLU + HellaSwag
- Grading: Perplexity table + accuracy within 3% threshold per task

**B2 — Qwen3.5 MoE AWQ with Per-Channel vs Per-Token Comparison**
- Quantize Qwen3.5-35B-A3B MoE (note known AWQ MoE mapping bug)
- Compare quantization strategies, document known workarounds
- Grading: Comparison table (file size, perplexity, benchmark scores)

**B3 — INT4 vs INT8 vs BF16 Full Benchmark**
- Benchmark three formats on a real inference workload
- Measure: throughput, latency p50/p95/p99, GPU memory, accuracy
- Grading: All three formats benchmarked + recommendation justified

**B4 — Self-Quantization with Intel AutoRound**
- Use auto-round to quantize a model without calibration dataset
- Compare against AWQ with calibration
- Grading: AutoRound results compared against AWQ baseline

**B5 — GGUF Export for llama.cpp with CPU Inference**
- Export AWQ model to GGUF format
- Run llama.cpp server on CPU and measure latency
- Grading: GGUF generated + CPU inference runs + latency reported

---

### Category C: RL / Fine-tuning (4 tasks)

**C1 — GRPO Training Loop on GSM8K**
- Set up GRPO with custom accuracy + format rewards
- Train 1.5B model for 100 steps
- Evaluate against baseline
- Grading: Training completes + evaluation score improvement documented

**C2 — LoRA Fine-tuning with Axolotl**
- Fine-tune Qwen3.5-9B with LoRA on a coding task dataset
- Experiment with rank (8, 16, 64) and alpha (16, 32)
- Grading: All ranks trained + comparison table + best config identified

**C3 — DPO Training with TRL**
- Run DPO training on preference data
- Evaluate with and without the DPO-trained model
- Grading: DPO improves evaluation metric by documented amount

**C4 — Debug a Failing GRPO Training Run**
- Given a crashed training run with logs, diagnose reward hacking vs. genuine failure
- Grading: Correct diagnosis + fix applied + training resumes

---

### Category D: Mixed Debugging / Multi-hop (3 tasks)

**D1 — End-to-End Model Serving Pipeline**
- Take a model from HuggingFace → quantize → serve with vLLM → benchmark → document
- Full pipeline: quantization → serving → eval → report
- Grading: All stages complete + final report with numbers

**D2 — Reproduce and Fix a Known vLLM Issue from GitHub**
- Given a GitHub issue number, the agent must reproduce it, find the fix, and verify it works
- Grading: Issue reproduced + fix applied + verified

**D3 — Build a Quantized Model Benchmarking Suite**
- Agent must design and implement its own benchmarking framework
- Must handle 3 quantization formats, 3 benchmarks, produce a comparison dashboard
- Grading: Framework runs + comparison table + code quality review

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

### Compaction Injection

Simulated by injecting a "context summary" tool result at the specified step threshold:

```
[COMPACTION EVENT] Previous context summarized. Key state:
- Task goal: deploy vLLM with tensor_parallel=2
- Completed steps: 1) researched vLLM docs 2) installed vLLM 3) wrote launch script
- Pending: benchmark, tune KV cache, document results
```

Agent receives this mid-task and must continue correctly.

### Research Quality Scoring

If `research_required: true`, the grader checks transcript for:
- At least 5 distinct documentation/API lookups
- At least 1 source cited in final output
- Research steps precede implementation steps

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

```
LongHorizonBench/
├── benchmark.py              # Main runner (extends pinchbench benchmark.py)
├── lib_grading.py            # Extended grading with compaction + research checks
├── lib_agent.py              # OpenClaw agent execution + compaction injection
├── lib_compaction.py         # NEW: compaction simulation engine
├── lib_research_tracker.py   # NEW: tracks research steps in transcript
├── tasks/                    # Task definitions
│   ├── category_a_inference/
│   │   ├── task_a1_vllm_multigpu.md
│   │   └── ...
│   ├── category_b_quantization/
│   ├── category_c_rl_finetuning/
│   └── category_d_mixed/
├── assets/                   # Fixture files per task
│   ├── a1/
│   │   ├── broken_config.yaml
│   │   └── sample_workload.jsonl
│   └── ...
├── scripts/
│   ├── run.sh                # Main entry
│   ├── inject_compaction.py   # Standalone compaction injection tool
│   └── eval_research.py      # Evaluate research quality
└── results/                  # Output from runs
```

---

## 8. KEY DIFFERENCES FROM PINCHBENCH

| Aspect | PinchBench | LongHorizonBench |
|--------|-----------|-----------------|
| Tool calls per task | 1–5 | 10–50 |
| Compaction | Not tested | First-class metric |
| Research-first tasks | No | Yes (graded) |
| Domain focus | General productivity | ML/LLM engineering |
| Grading | Outcome only | Outcome + process |
| Compaction recovery | Not measured | Measured per-event |
| Tool call budget | No | Yes (efficiency scoring) |

---

## 9. INSPIRATION SOURCES

- **LOCA-bench** (arXiv:2602.07962) — context growth scaling, context rot measurement
- **llm-compaction-benchmark** (va2ai/llm-compaction-benchmark) — compaction quality evaluation
- **ToolComp** (Scale Labs) — multi-step tool reasoning with per-step supervision
- **GAIA** (ICLR 2024) — "simple for humans, hard for AI" real-world difficulty
- **TheAgentCompany** (ICML 2025) — real-world workplace task completion
- **τ-bench** — customer service multi-turn tool-dialogue
- **SWE-bench** — code bug reproduction and fixing (inspiration for D2/D3)

---

## 10. OPEN QUESTIONS

1. **Compaction injection timing** — hard-coded step count vs. token-threshold? Step count is more predictable but token count is more realistic.
2. **Grading research quality** — should it be automated (count lookups) or LLM-judged (did the agent read the RIGHT docs)?
3. **Hardware requirements** — tasks A1–A5 need GPUs. Should the benchmark support a "planning-only" mode where agent produces a plan without executing?
4. **Baseline models** — which models to run first? Qwen3.5-9B via vLLM on local RTX 3060 is the minimum viable setup.
5. **Leaderboard** — self-hosted or public? Similar to pinchbench's api.pinchbench.com?
