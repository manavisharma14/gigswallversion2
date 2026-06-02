# GigsWall

A two-sided hiring marketplace that connects freelancers with recruiters using semantic search and AI-powered candidate ranking. Built and shipped solo to 2,100 production users, validated by KU Accelerator ($6K award).

**Live:** [gigswall.com](https://gigswall.com) &nbsp;·&nbsp; **Stack:** Next.js · MongoDB · Redis · OpenAI

---

## What it does

Most hiring platforms match on keywords. A recruiter posts "React developer, 3 years experience" and gets back everyone who typed those exact words — not the best person for the job.

GigsWall uses semantic search and LLM reranking to understand what a recruiter actually needs and surface candidates who fit, even if their profile uses different words. On the other side, freelancers see gigs ranked by genuine relevance to their skills, not recency or keyword overlap.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       Next.js App                        │
│                                                         │
│   ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│   │   UI / Pages │  │  API Routes  │  │  WebSocket  │  │
│   │  (React/     │  │  (Matching · │  │  Feed Engine│  │
│   │   Tailwind)  │  │  AI Agents · │  │  (pub/sub)  │  │
│   │              │  │  Auth · Pay) │  │             │  │
│   └──────────────┘  └──────┬───────┘  └──────┬──────┘  │
│                             │                 │         │
│   ┌─────────────────────────▼─────────────────▼──────┐  │
│   │                Redis (pub/sub + caching)          │  │
│   └──────────────────────┬────────────────────────────┘  │
│                          │                              │
│   ┌──────────────────────▼────────────────────────────┐  │
│   │                    MongoDB                        │  │
│   │     Users · Gigs · Matches · Events · Payments   │  │
│   └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Key engineering decisions

### Semantic search pipeline
Keyword search on short gig descriptions returns poor signal — a gig titled "need a React wizard" never matches a profile that says "frontend engineer, 4 years." 

The matching pipeline generates OpenAI embeddings for every gig and candidate profile, stores them in MongoDB with a vector index, and runs LLM reranking on the top-k results before returning matches. Match conversion is 3.4× higher than the keyword baseline measured over a 90-day cohort.

### Real-time feed via WebSocket + Redis pub/sub
The original matching feed ran synchronous DB queries with full recompute on every request. Under normal load this meant 4.1s before a recruiter saw a new candidate surface.

Replaced with a WebSocket/Redis pub-sub push model — when a new profile or gig is created, an event is published to Redis, subscribers recompute only the affected slice, and the result is pushed to connected clients. Recruiter-response latency dropped to 0.7s, engagement up 34%.

### AI hiring agents (LangGraph)
Three-stage pipeline triggered when a recruiter opens a candidate:
1. **Ranker** — scores fit against the job description using structured LLM output
2. **Summarizer** — generates a 3-sentence candidate brief grounded in their actual profile
3. **Fit scorer** — produces an explanation of strengths and gaps the recruiter can act on

Built with LangGraph so each stage is independently retryable and observable. Recruiter throughput 4× vs. manual review.

### P95 latency
Profiled P95 at 3.1s under normal load. Root causes: unindexed queries on the matches collection, hot-path reads hitting MongoDB on every request, and synchronous scoring blocking the response.

Fixed with targeted MongoDB indexes, Redis caching on hot paths, and async worker offloading for scoring. P95 dropped to 890ms with no infrastructure additions.

---

## Features

**For recruiters**
- Post gigs with structured or freeform descriptions
- AI-ranked candidate feed with fit scores and summaries
- Real-time match notifications
- In-app chat with candidates
- Payment processing for hired freelancers

**For freelancers**
- Semantic gig feed ranked by genuine relevance
- Profile with skills, portfolio, and availability
- Application tracking
- In-app chat and payment receipt

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | MongoDB (primary), Redis (cache + pub/sub) |
| AI/ML | OpenAI embeddings, LLM reranking, LangGraph |
| Auth | NextAuth |
| Payments | Stripe |
| Infra | AWS (EC2, S3, SQS), Docker |

---

## Production

Live at [gigswall.com](https://gigswall.com) — 2,100 users, processing active matches daily.

---

## Author

**Manavi Sharma** — [manavisharma.com](https://manavisharma.com) · [linkedin.com/in/manavi-sharma14](https://linkedin.com/in/manavi-sharma14)
