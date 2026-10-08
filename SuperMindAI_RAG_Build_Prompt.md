# SUPERMIND AI — RAG BUILD PROMPT

> Paste this whole file into Antigravity (or your build agent) as its own task, after Phase 4 (Multi-Model Orchestration) is working. It builds exactly what's specified in `SuperMindAI_RAG_Design.md` — read that file first if you haven't, everything below assumes it.

---

## ROLE & CONTEXT

You are implementing the Retrieval-Augmented Generation (RAG) document-analysis feature for SuperMind AI, exactly as specified in `docs/SuperMindAI_RAG_Design.md`. This plugs into the existing NestJS backend and the Supervisor AI pipeline as a new `Context Retrieval` step between Intent Detection and Prompt Optimization. Follow the file structure conventions in `docs/SuperMindAI_File_Structure_Prompt.md`.

## BEFORE YOU START — confirm these exist, don't assume

Check and report on each before writing code:
1. Is the `pgvector` extension available and enabled on the PostgreSQL instance? If not, this blocks everything — stop and ask me to enable it (managed Postgres providers vary in how this is done).
2. Is there a working Redis-backed job queue (BullMQ) already running a worker process, or does one need to be added? If the current deployment is a single process, ask me how I want the worker run (in-process vs. separate container) rather than guessing.
3. Which embedding provider/model am I actually using? Check `.env` for existing API keys (OpenAI, Gemini, Anthropic) and ask me to confirm which one to use for embeddings if it's not obvious — this decision is expensive to reverse (Section 4 of the design doc: changing embedding models means re-embedding every stored document).
4. Is an S3 (or S3-compatible) bucket already configured for file storage, or does one need to be provisioned? Ask for credentials if not already in `.env` — do not invent placeholder keys and continue as if they're real.

Do not proceed past this section until all four are confirmed or explicitly stubbed with my sign-off.

---

## BUILD PHASES — work through these in order, verify each before starting the next

### Phase 1 — Core ingestion pipeline (PDF + TXT only)
- `documents` and `document_chunks` tables/migrations, exactly per Section 7 of the design doc (including the `pgvector` column, HNSW index, GIN index on `content_tsv`).
- Upload endpoint (`POST /api/v1/documents/upload`) that stores the file in object storage and creates a `documents` row with `status: pending`.
- Async job pipeline (BullMQ): parse → clean → chunk → embed → store, using the module structure in Section 8 (`processors/parse.processor.ts`, `chunk.processor.ts`, `embed.processor.ts`).
- Semantic chunking per Section 3.3: paragraph-boundary aware, ~500–800 tokens, ~15% overlap, with page number and chunk index preserved as metadata.
- Status correctly transitions `pending → processing → ready`, or `→ failed` with a real error reason on failure — never fail silently.
- **Verify**: upload a real multi-page PDF, confirm rows appear in `document_chunks` with correct page numbers and non-null embeddings, confirm `documents.status` reaches `ready`.

### Phase 2 — Vector-only retrieval
- `retrieval/hybrid-search.service.ts` (vector-only for now — hybrid comes in Phase 3).
- Internal endpoint `POST /internal/retrieval/search` per Section 9: takes `{ query, user_id, conversation_id, top_k }`, returns ranked chunks.
- Every query MUST filter by `user_id` at the database/query level, not in application code after fetching — per Section 11, treat a query missing this filter as a bug.
- **Verify**: query for something you know is in the uploaded document, confirm the correct chunk comes back; query as a different `user_id`, confirm you get nothing from another user's documents even if the content would otherwise match.

### Phase 3 — Hybrid search + re-ranking
- Add keyword search (Postgres `tsvector`/`tsquery`) alongside vector search, combine both per Section 6.
- Add the re-ranking pass (`reranker.service.ts`) that narrows top-k≈20 candidates down to the top 3–5 actually injected into context.
- **Verify**: run the Section 12 evaluation — build the 15–20 question test set against real sample documents, measure recall@5. Report the number. If it's poor, tell me before proceeding rather than pushing on to Phase 4 with known-bad retrieval.

### Phase 4 — Wire into the Supervisor pipeline + chat UI
- Add `Context Retrieval` as a real step in the Supervisor pipeline, between Intent Detection and Prompt Optimization, only triggered when the conversation has attached documents.
- Retrieved chunks' metadata flows through to the final response as citations ("Source: filename, p.4").
- Chat UI: uploading a document shows a processing state and blocks questions about it until `status: ready` (per Section 10 — don't let the model answer from a half-ingested document).
- Citations render inline and expand to show the quoted chunk, reusing the existing reasoning-trace UI pattern and visual language (the routing-console signal-pulse motif — add a `Context Retrieval` node type to it, same visual grammar as the model-routing nodes).
- **Verify** with browser-in-the-loop: actually upload a document in the chat UI, ask a question about its contents, confirm the answer is grounded in the document and the citation links to the right chunk.

### Phase 5 — Expand file type support
- Add DOCX (`mammoth`) and CSV (row-aware chunking per Section 3.3 — column headers attached to every chunk).
- Add OCR for scanned PDFs/images only if I've confirmed an OCR provider in the "before you start" section — otherwise leave this phase stubbed and tell me.
- **Verify**: repeat the Phase 1 upload verification for each new file type.

---

## SECURITY — non-negotiable, verify explicitly at the end

- [ ] Every retrieval query scoped by `user_id` at the database level
- [ ] Deleting a document cascades to delete its chunks (no orphaned vectors) — test this explicitly, don't just check the migration has `ON DELETE CASCADE`
- [ ] Object storage paths are per-user-prefixed with access control, not a shared public bucket
- [ ] No cross-user retrieval, even for byte-identical uploaded files

## DO NOT

- Do not silently swap the embedding model partway through if the first choice seems suboptimal — that breaks similarity search for every chunk already embedded. Flag it and ask.
- Do not skip the Section 12 evaluation and report Phase 3 "done" without a recall@5 number.
- Do not process uploads synchronously in the request/response cycle — this must be async via the job queue, even for small files, so the pattern is correct before it's tested at scale.
- Do not invent or hardcode API keys/credentials — stop and ask per the "before you start" section.

## REPORT AFTER EACH PHASE

What was built, what was verified (with actual evidence — a query result, a screenshot, a recall@5 number — not just "it works"), what's stubbed and why, and what you need from me to continue.
