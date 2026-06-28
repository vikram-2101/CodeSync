Phase 0.3 — Shared ESLint Configuration

Before we write a single configuration file, let's understand why ESLint exists.

Problem

Imagine three developers working on CodeSync.

Alice writes
const name = "Vikram";
Bob writes
var name = "Vikram";
Charlie writes
const Name = "Vikram"

Notice:

inconsistent variable naming
missing semicolon
different quote styles
var instead of const

All of this still works.

The program runs.

But now imagine this across 300 developers and 2 million lines of code.

The project slowly becomes inconsistent.

Code reviews become filled with comments like:

"Please use const."

"Use single quotes."

"Don't use any."

"Unused variable."

Instead of discussing architecture, developers spend their time discussing formatting and style.

This doesn't scale.

Naive Approach

A beginner usually solves this by relying on personal discipline.

For example:

"Everyone should remember to use const."

or

"Please don't use any."

This works...

until someone forgets.

Then another person forgets.

Then another joins the company.

Soon every file looks different.

Another naive solution is:

Each project creates its own .eslintrc.

frontend/
.eslintrc

backend/
.eslintrc

docs/
.eslintrc

Now suppose your team decides:

We no longer allow console.log() in production.

You now have to update:

frontend
backend
packages
workers
services

One small rule...

20 different config files.

Someone forgets one.

Now different parts of the monorepo follow different standards.

Industry Approach

Large companies almost never duplicate ESLint configurations.

Instead they create one reusable package.

packages/

    eslint-config/
        base.js
        react.js
        node.js

Every application simply imports it.

apps/web

extends:
@codesync/eslint-config/react
apps/server

extends:
@codesync/eslint-config/node

One source of truth.

One update.

Entire repository changes instantly.

This is exactly how many mature monorepos are structured.

Why a Package?

Because configuration is also code.

Think about TypeScript.

Instead of copying

tsconfig.json

everywhere,

we already created

packages/tsconfig

Same philosophy.

Now we're doing it for linting.

Why Not Just Put One .eslintrc at the Root?

This is one of the first questions people ask.

It seems easier.

root
.eslintrc

Works for small projects.

Problems appear later.

For example:

Suppose later we build another project.

CodeSync
Inventory
Payments
Analytics

Each one wants the same lint rules.

A root config cannot be reused.

A package can.

Even inside one repository, different parts often need slightly different rules:

React

Node

Library

CLI

Scripts

A shared package lets us compose those configurations cleanly.

Why Not Copy the Config?

Because copied code eventually diverges.

Imagine fixing a bug in five copies of the same file.

That's exactly what shared packages prevent.

The Architecture We'll Build
packages/

    eslint-config/

        package.json

        base.js

        react.js

        node.js

Later:

apps/web

eslint.config.js

will simply say

import react from "@codesync/eslint-config/react";

No duplicated rules.

A Quick Note on ESLint's New Flat Config

ESLint introduced a new configuration system called Flat Config (eslint.config.js or eslint.config.mjs), which replaces the older .eslintrc.* format.

Why it matters:

It's the current and recommended approach.
It uses standard JavaScript modules instead of a custom configuration format.
It gives better control over configuration composition.
Most new projects are moving to it, and we'll build on it from the start.

This means you'll see eslint.config.mjs files rather than .eslintrc.json.

Implementation

We'll start by creating the shared package structure.

packages/
└── eslint-config/
├── package.json
├── base.js
├── node.js
├── react.js
└── README.md

At this stage, we're only laying out the package. In the next step, we'll populate these files with actual lint rules and wire them into our apps.

Engineering Insight

A common misconception is that ESLint is just for formatting.

It's not.

ESLint's primary job is to catch code quality and correctness issues:

Unused variables
Unreachable code
Accidental globals
Incorrect hook usage in React
Dangerous patterns
TypeScript-specific mistakes (with the right plugins)

Formatting (spaces, quotes, line breaks) is better handled by Prettier. Keeping these responsibilities separate reduces configuration conflicts and simplifies maintenance.
