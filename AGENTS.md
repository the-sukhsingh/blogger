<!-- intent-skills:start -->

## Skill Loading

Use the repository’s installed Intent. If it is unavailable, report the missing dependency instead of downloading a replacement.
Before editing files for a substantial task:

- Run `npm exec --no -- intent list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npm exec --no -- intent load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->

<!-- Project Description:start -->

# Agent — AI Publishing System for Technical Blogs

## 1. Product Vision

This product is **not another CMS**.

It is an AI-powered publishing workspace for developers, engineers, indie hackers, researchers, and technical writers who already have a personal blog—often backed by Markdown/MDX and Git—but want a much better way to create, improve, manage, and maintain their content.

The core idea:

> **Treat a technical blog like a codebase.**

A codebase has an editor, Git, diffs, linting, dependency updates, tests, CI, and maintenance. A growing technical blog needs similar intelligence:

- understand the existing content
- identify gaps and duplication
- help create technically strong articles
- improve discoverability
- maintain internal links
- detect stale information
- propose updates
- preserve author ownership and writing style
- keep publishing compatible with the author's existing website

The product should therefore sit above the content source rather than forcing the writer to migrate to a new blogging ecosystem.

---

# 2. What Makes It Different

The product should not compete with traditional CMSs on:

- rich text editing
- media uploads
- categories
- tags
- basic SEO fields
- Markdown support
- publishing

Those are expected capabilities.

The differentiation is **content intelligence across the entire publication**.

The system understands the relationship between:

- the author's existing articles
- topics and concepts
- entities
- internal links
- writing style
- article freshness
- technical claims
- search intent
- answer-engine discoverability
- publishing history

Instead of simply asking:

> "How do I write this article?"

the system can answer:

> "Does this article make sense given everything else I have already written?"

And instead of only helping publish:

> "How do I keep this article useful six months from now?"

---

# 3. Product Philosophy

## Git-friendly, not Git-hostile

If a writer already owns a Markdown/MDX blog, the product should not demand migration.

The ideal experience is:

```text
Existing Blog
     ↓
Connect Repository
     ↓
Understand Existing Content
     ↓
Write / Edit in Custom Editor
     ↓
AI Review
     ↓
SEO + AEO + Content Intelligence
     ↓
Review Changes
     ↓
Publish
     ↓
Commit / Sync Back to Existing Workflow
```

The writer should feel like they gained a professional publishing interface without losing control of their content.

---

# 4. Core User Journey

## Step 1 — Connect an Existing Blog

The user connects their existing content source.

The system imports or indexes their articles and begins understanding the publication.

It should identify:

- articles
- titles
- topics
- concepts
- entities
- links
- code examples
- references
- publication dates
- metadata
- article relationships

The first experience should communicate:

> "I understand your blog."

Not:

> "Create your first post."

---

# 5. Publication Understanding

The system should build a mental model of the entire publication.

For every article, it should understand:

### Topic

What is the article fundamentally about?

### Intent

Why would someone search for or read it?

### Concepts

What concepts are explained?

### Entities

What technologies, products, libraries, companies, people, standards, or frameworks are mentioned?

### Relationships

Which other articles are related?

### Internal links

What content does the article reference?

### Freshness

Which claims, technologies, examples, or references may become outdated?

### Quality

How complete, understandable, useful, and technically coherent is the article?

This understanding powers the rest of the product.

---

# 6. The Custom Editor

The editor should be one of the strongest parts of the product.

It should feel like a purpose-built writing environment rather than a generic CMS editor.

## Design direction

The editor should be:

- clean
- minimal
- distraction-free
- fast
- typography-focused
- keyboard-friendly
- visually calm
- professional
- optimized for long-form technical writing

Avoid:

- excessive panels
- colorful AI widgets everywhere
- unnecessary buttons
- generic "AI SaaS" styling
- huge toolbars
- excessive cards and shadows

The article should remain the visual focus.

---

# 7. Editor Layout

A strong default layout:

```text
┌───────────────────────────────────────────────────────────┐
│ Logo     Article Title             Save   Preview Publish │
├───────────────────────────────────────────────────────────┤
│                                                           │
│                                                           │
│                    ARTICLE CONTENT                        │
│                                                           │
│        Heading                                            │
│                                                           │
│        Paragraph paragraph paragraph...                   │
│                                                           │
│        Code example                                       │
│                                                           │
│                                                           │
│                                      ┌──────────────────┐ │
│                                      │ AI / Insights    │ │
│                                      │                  │ │
│                                      │ Suggestions      │ │
│                                      │ Links            │ │
│                                      │ SEO              │ │
│                                      │ AEO              │ │
│                                      └──────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

The right-side intelligence panel should be contextual and collapsible.

The writer should be able to hide it completely.

---

# 8. Writing Experience

The editor should support technical writing naturally.

The writer can use:

- headings
- paragraphs
- lists
- quotes
- links
- images
- code blocks
- inline code
- tables
- callouts
- embeds
- references

The interface should make Markdown/MDX users comfortable without requiring them to manually think about Markdown syntax.

A Markdown source view can still exist for advanced users.

The key principle:

> **Visual editing for convenience, source control for control.**

---

# 9. Slash Commands

The editor can use a minimal slash-command system.

Examples:

```text
/heading
/code
/image
/table
/quote
/callout
/link
```

AI commands can also exist:

```text
/improve
/explain
/shorten
/expand
/rewrite
/add-example
```

However, AI actions should never dominate the editor.

---

# 10. Contextual AI

The AI should understand where the writer is working.

If the cursor is inside a paragraph, the assistant should work on that paragraph.

If the writer selects a section, it should work on that section.

If nothing is selected, it can reason about the article.

If the writer asks a publication-level question, it should reason about the entire blog.

Example:

> "Can I explain this more clearly?"

The system should understand the selected passage and propose an improved version.

The writer should be able to:

- accept
- reject
- edit
- compare

AI output should feel like an intelligent suggestion, not an uncontrolled rewrite.

---

# 11. AI Should Use Diffs

Every meaningful AI modification should be reviewable.

Example:

```text
AI changed 3 paragraphs

Before
React Server Components allow...

After
React Server Components let you...

[Accept] [Reject]
```

The writer remains in control.

This is especially important for technical writing because blindly accepting AI-generated technical content can introduce incorrect claims.

---

# 12. Article Intelligence

Every article should have an intelligence layer.

The system continuously evaluates:

### Content completeness

Does the article sufficiently answer its intended question?

### Clarity

Can the reader understand the article without unnecessary effort?

### Structure

Are headings and sections logically organized?

### Technical quality

Are concepts explained accurately and in the appropriate depth?

### Search intent

Does the article actually satisfy what someone looking for the topic needs?

### AEO readiness

Can important answers be easily extracted and understood by answer engines?

### Internal linking

Are relevant existing articles linked?

### Freshness

Are technologies, APIs, examples, statistics, and references still current?

---

# 13. SEO

SEO should be treated as part of the writing workflow rather than a form with a green score.

The system can evaluate:

- title
- description
- heading hierarchy
- search intent
- topic coverage
- internal links
- canonical information
- structured data
- image metadata
- URL quality
- readability

Instead of saying:

> SEO Score: 82

the product should explain:

> Your article answers the main question well, but the primary definition appears too late. Moving it into the introduction would make the article more useful for both readers and search systems.

The goal is **actionable intelligence**, not vanity scores.

---

# 14. AEO — Answer Engine Optimization

AEO should be one of the major differentiators.

The product should evaluate whether an article is easy for answer systems to understand and accurately summarize.

It should look for:

- clear definitions
- direct answers
- explicit explanations
- logically structured sections
- question-oriented headings where appropriate
- supporting evidence
- authoritative references
- clear relationships between concepts
- unnecessary ambiguity
- buried answers

Example:

```text
Question:
"What is a vector database?"

Article analysis:

✓ Definition exists
✓ Explanation is technically clear
✓ Example exists
⚠ Main definition appears too late
✓ Supporting concepts exist
⚠ No authoritative reference
```

The AI should suggest improvements rather than mechanically stuffing FAQs into every article.

---

# 15. Content Graph

The product should represent the blog as a connected knowledge graph.

For example:

```text
                 AI Agents
                 /       \
                /         \
             RAG         MCP
             /             \
       Embeddings        Tools
          |
      Vector DB
```

The graph allows the system to understand relationships between articles.

This enables:

- internal-link suggestions
- content gap discovery
- duplicate-topic detection
- topic clustering
- series suggestions
- related article discovery
- content strategy

The graph is an internal intelligence model, not necessarily something the writer must always see.

A visual graph can be offered as an optional exploration interface.

---

# 16. Internal Linking

When the writer mentions a concept that already exists in their blog, the system can suggest a relevant article.

Example:

> "Vector databases are commonly used in RAG systems..."

The system recognizes:

> Existing article: **Understanding Vector Databases**

Suggestion:

> Link this phrase to "Understanding Vector Databases"?

The system should avoid excessive linking.

Suggestions should be based on genuine contextual relevance.

---

# 17. Content Gap Discovery

The writer should be able to ask:

> "What should I write next?"

The answer should be based on the writer's actual publication.

The system examines:

- current topics
- existing article relationships
- missing concepts
- weakly covered areas
- overlapping articles
- reader/search intent
- potential internal-link opportunities

Example:

```text
Recommended next article

Production Security for RAG Applications

Why:
• You already have 6 RAG-related articles
• Security is barely covered
• It connects to 5 existing articles
• It creates a new topic cluster
• It avoids overlap with your existing posts
```

This is significantly more useful than generating ten generic blog ideas.

---

# 18. Article Overlap Detection

Before writing a new article, the system should check whether similar content already exists.

Example:

> "You already have an article covering 70% of this topic."

It should explain:

- what overlaps
- what is genuinely new
- whether the new article should become an update
- whether it should be merged
- whether it should target a different intent

The system should help prevent a blog from becoming a collection of near-duplicate articles.

---

# 19. Article Health

Every published article should have a health state.

Example:

```text
Article Health

Content       92
SEO           87
AEO           81
Links         95
Freshness     63
Technical     89
```

But the numbers are secondary.

The important part is the explanation.

Example:

> This article is becoming stale.

Reasons:

- referenced API has changed
- package version is outdated
- one external link is broken
- an example no longer follows current documentation

---

# 20. Content Refresh Agent

One of the most valuable agents should be the **Content Refresh Agent**.

It periodically identifies articles that may need attention.

For each candidate, it investigates:

- outdated technical information
- changed APIs
- old package versions
- broken links
- outdated screenshots
- obsolete recommendations
- changed terminology
- missing developments

It should never silently rewrite published content.

Instead:

```text
Article needs review

3 potential updates found.

[Review changes]
```

The writer sees proposed changes as a diff.

---

# 21. Research Agent

Before writing, the writer can ask the system to research a topic.

The agent should produce:

- important concepts
- questions readers may have
- competing perspectives
- authoritative references
- current technical information
- suggested structure
- relationship to existing blog content

The research should remain separate from the final article until the writer chooses what to use.

The system should distinguish between:

> "Research says this"

and:

> "Your article says this."

This reduces accidental AI hallucinations.

---

# 22. Writing Agent

The Writing Agent helps transform an outline or rough notes into a structured article.

However, it should preserve:

- author's voice
- technical preferences
- existing terminology
- intended depth
- article purpose

It should not turn every article into generic AI-written prose.

The writer remains the author.

AI is the collaborator.

---

# 23. Author Voice

Over time, the system can learn the author's preferred style from existing writing.

It can understand patterns such as:

- sentence length
- technical depth
- preferred terminology
- explanation style
- use of examples
- level of formality
- use of humor
- formatting preferences

When the writer asks:

> "Rewrite this."

the result should sound like **the author**, not like a generic AI assistant.

---

# 24. Publishing Workflow

The complete lifecycle should look like:

```text
Idea
 ↓
Research
 ↓
Outline
 ↓
Draft
 ↓
AI / Technical Review
 ↓
SEO / AEO Review
 ↓
Internal Link Review
 ↓
Final Preview
 ↓
Publish / Schedule
 ↓
Git Sync
 ↓
Website Deployment
```

The writer can skip steps when appropriate.

The product should never force unnecessary workflow.

---

# 25. Preview

The writer should have a realistic preview of the final article.

Preview modes can include:

### Article

What the reader sees.

### Search

How the article metadata may appear in search results.

### Answer

How the important answers and definitions are structured for answer systems.

### Social

How the article will appear when shared.

The preview should remain clean and useful rather than becoming a collection of mockups.

---

# 26. Publishing

Publishing should be explicit.

Before publishing, the system can show:

```text
Ready to publish

✓ Content complete
✓ Metadata complete
✓ Internal links checked
✓ No critical issues
✓ AEO review complete
✓ Preview checked

2 optional suggestions remain
```

Optional warnings should never block publishing unless the writer chooses to enforce strict checks.

---

# 27. Scheduling

The writer can schedule articles.

The product should handle:

- scheduled publishing
- timezone awareness
- publishing status
- future article preview
- cancellation
- rescheduling

The writer should always know exactly what will happen and when.

---

# 28. Git Integration

Git should remain a first-class concept.

When publishing, the product can create a clean change representing the article.

The writer should be able to see:

```text
Article published

Changes:
+ New article
+ Metadata
+ Internal links
```

If an existing article was updated:

```text
Article updated

12 additions
4 removals
3 metadata changes
```

The goal is to make AI-assisted publishing feel as trustworthy as a code review.

---

# 29. Analytics Should Feed Intelligence

Analytics should not merely show:

```text
Views: 4,821
```

The system should turn performance into content intelligence.

For example:

> This article receives substantial traffic but has weak internal-link engagement.

Or:

> Readers appear to discover this article through a question your article doesn't answer directly.

Or:

> This article is becoming an important entry point into your RAG topic cluster.

Analytics should improve future writing decisions.

---

# 30. Publication-Level Chat

The writer should be able to ask questions about their entire publication.

Examples:

> "Which articles are outdated?"

> "What topics do I write about most?"

> "Where do I have content gaps?"

> "Which articles should link to this one?"

> "Do I have duplicate articles?"

> "Show me my strongest topic cluster."

> "What should I write next?"

> "Which articles haven't been updated in a year?"

The AI should answer using the user's actual publication, not generic knowledge.

---

# 31. Agent Roles

Instead of one giant AI agent doing everything, the product can conceptually divide responsibilities.

## Publication Analyst

Understands the entire blog.

Responsibilities:

- content graph
- topic clusters
- gaps
- overlap
- relationships
- content strategy

## Research Agent

Investigates new topics.

Responsibilities:

- research
- references
- current information
- questions
- outline recommendations

## Writing Agent

Helps create and improve content.

Responsibilities:

- drafting
- rewriting
- structure
- clarity
- author's voice

## SEO Agent

Reviews discoverability.

Responsibilities:

- search intent
- metadata
- structure
- internal linking
- technical SEO

## AEO Agent

Reviews answerability.

Responsibilities:

- direct answers
- definitions
- entity relationships
- evidence
- answer extraction quality

## Content Health Agent

Maintains existing articles.

Responsibilities:

- freshness
- broken links
- outdated information
- technical changes
- refresh recommendations

These agents should feel like one coherent product rather than separate bots.

---

# 32. Human-in-the-Loop Principle

The product should never make the author feel that AI owns their publication.

Important principle:

> **AI proposes. Author decides.**

AI can:

- analyze
- recommend
- research
- draft
- rewrite
- detect
- compare
- suggest

The author controls:

- what gets published
- what gets changed
- what gets deleted
- what gets linked
- what becomes part of their voice

Every significant AI modification should be reversible.

---

# 33. Clean UX Principle

The product should feel closer to a premium writing application than a traditional admin dashboard.

Use:

- restrained colors
- strong typography
- generous but not excessive whitespace
- subtle borders
- minimal controls
- keyboard shortcuts
- fast interactions
- contextual panels
- clear hierarchy

Avoid:

- dashboard clutter
- dozens of cards
- rainbow AI indicators
- giant gradients
- unnecessary animations
- constant notifications

The interface should make writing feel calm.

---

# 34. The Main Product Loop

The most important loop is:

```text
WRITE
  ↓
UNDERSTAND
  ↓
IMPROVE
  ↓
PUBLISH
  ↓
OBSERVE
  ↓
MAINTAIN
  ↓
LEARN
  ↓
WRITE BETTER
```

Every cycle makes the system more useful because it understands more about the publication.

---

# 35. Example End-to-End Scenario

The writer wants to publish:

> "Building an MCP Server with TypeScript"

They create a new article.

The system immediately checks their publication.

It finds:

- 2 articles mentioning MCP
- 1 TypeScript article
- 1 AI agents article
- no dedicated MCP security article

It tells the writer:

> You already explain MCP basics in another article. Consider focusing this article on implementation rather than repeating the introduction.

The writer researches the topic.

The Research Agent provides:

- current concepts
- relevant documentation
- important implementation considerations
- suggested structure

The writer drafts the article in the custom editor.

The system notices:

> You mention authentication but don't explain it.

It suggests a section.

The writer accepts it.

The system notices:

> "MCP" is mentioned 11 times, but you have an existing article explaining the protocol.

It suggests an internal link.

The SEO Agent notices:

> The article title is descriptive but doesn't clearly express the implementation intent.

It proposes alternatives.

The AEO Agent notices:

> The answer to "How do I build an MCP server in TypeScript?" is buried inside the article.

It suggests moving the key explanation closer to the beginning.

The writer reviews everything.

The final article is published.

Later, the Content Health Agent detects that an API referenced in the article has changed.

The writer receives:

> This article may be outdated.

They open it.

The proposed changes appear as a diff.

The writer accepts the relevant changes.

The article is updated.

That is the complete product story.

---

# 36. What the Product Should Ultimately Feel Like

The user should feel:

> "This understands my blog."

Not:

> "This is another place where I edit Markdown."

And:

> "It helps me maintain my knowledge."

Not:

> "It generates blog posts for me."

And:

> "I still own everything."

Not:

> "My content is trapped inside an AI CMS."

---

# 37. One-Sentence Definition

> **An AI-native publishing workspace that understands a technical blog as a living knowledge base—helping its author research, write, optimize, publish, connect, and continuously maintain content while keeping the underlying content and Git workflow under the author's control.**

---

# 38. MVP Direction

The first version should not attempt to build a complete CMS.

Focus on the unique intelligence layer.

The MVP should make these four things excellent:

### 1. Connect

Connect an existing Markdown/MDX Git repository and understand its content.

### 2. Write

Provide the custom clean editor for creating and editing articles.

### 3. Understand

Provide publication-aware AI:

- content graph
- internal links
- overlap detection
- content gaps
- publication chat

### 4. Improve

Provide article-aware:

- writing assistance
- SEO analysis
- AEO analysis
- technical review
- freshness detection

Publishing and advanced CMS functionality should support these capabilities rather than become the product itself.

---

# 39. Product North Star

The north-star question for every feature should be:

> **Does this help a technical writer build a better publication, rather than simply manage more content?**

If the answer is no, it is probably a generic CMS feature and should not be a priority.

The product wins by becoming the **intelligence layer between the writer and their existing publishing system**.

<!-- Project Description:end -->
