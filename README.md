# MementoMori – Life in a Few Weeks

A small project inspired by the idea of ​​**MementoMori** – remembering that life is finite. This isn't just another timer or productivity tracker.

The idea is much simpler.

It turns the abstract concept of time into something you can actually see. Each week of your life becomes a tiny dot. Together, they create a visual map of your life – the weeks you've already lived, the week you're in now, and those yet to come.

This isn't meant to be depressing.
If anything, it's a reminder that **time is valuable**.


## What the app shows

After entering your birth date and estimated life expectancy, the app calculates:

* number of days lived
* number of days remaining
* number of weeks lived / number of weeks remaining
* number of years lived / number of years remaining
* number of days until your next birthday

There are also small contextual indicators showing:

* how much time has passed since **current year**
* how much time has passed since **current week**

And, of course, the main visual element is the **life grid**, where each dot represents a week.


## Life Grid

The grid is based on a simple idea:

```
life expectancy x 52 = total number of weeks
```

Each week becomes one dot.

* Golden dots → weeks already lived
* Glowing dot → Current week
* Dark dots → Future weeks

Hovering over a dot reveals which week it represents.


## Features

* Weekly life visualization
* Life progress indicator
* Detailed time statistics
* Customizable lifespan
* Birthday countdown
* Multilingual interface

Enabled languages:

* English
* Ukrainian
* Russian

Settings are stored locally in the browser.

No accounts, no servers.


## Technologies

Nothing special.

Only:

* **HTML**
* **CSS**
* **Vanilla JavaScript**

No frameworks, no dependencies. The idea is quite simple and doesn't require reinventing the wheel.

Everything works entirely in the browser.

## Project Structure

```
memento-mori
│
├─ index.html
│
├─ css
│ └─ style.css
│
├─ js
│ ├─ main.js
│ └─ i18n.js
│
└─ README.md
```


## Starting the Project

Simply clone the repository and open the HTML file.

```
git clone https://github.com/yourusername/memento-mori.git
cd memento-mori
```

Then open:

```
index.html
```

That's it.


## Ideas for the Future

Some things I might add later:

* random memento mori quotes that appear on every page load
* life grid export as an image
* minimalist theme switcher
* life milestones (important events displayed on the grid)


## Why I did this

The idea came about after I decided to organize my notes in Obsidian, after which I came across a YouTube video that implemented the idea in a note format with dataviewJs.

When you see your life broken down into weeks, something changes. You realize there are **much fewer of them than you thought**. And maybe it's good to remember that.

> "It is not that we have little time, but that we waste so much of it."
> — Seneca