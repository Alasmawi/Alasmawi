<div align="center">

<img src="./assets/banner.svg" alt="Abdulla Alasmawi — Full-Stack Developer | Cloud & DevOps | Bahrain" width="100%" />

<br/>

<a href="https://alasmawi.dev">
  <img src="https://img.shields.io/badge/PORTFOLIO-alasmawi.dev-22d3ee?style=for-the-badge&labelColor=0b1219&logo=vercel&logoColor=22d3ee" alt="Portfolio" />
</a>
<a href="mailto:alasmawiabdulla0@gmail.com">
  <img src="https://img.shields.io/badge/EMAIL-contact-5eead4?style=for-the-badge&labelColor=0b1219&logo=gmail&logoColor=5eead4" alt="Email" />
</a>
<a href="https://github.com/Alasmawi?tab=followers">
  <img src="https://img.shields.io/github/followers/Alasmawi?style=for-the-badge&labelColor=0b1219&color=818cf8&logo=github&logoColor=818cf8" alt="Followers" />
</a>
<img src="https://komarev.com/ghpvc/?username=Alasmawi&style=for-the-badge&color=22d3ee&label=PROFILE+VIEWS" alt="Profile views" />

<br/><br/>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=21&pause=1200&color=22D3EE&center=true&vCenter=true&width=760&lines=Full-stack+engineer+%E2%80%94+Go%2C+Rust%2C+Python%2C+JavaScript;I+build+the+app%2C+then+I+build+the+way+it+ships;From+a+Flask+API+on+Vagrant+to+ECS+Fargate+on+Terraform;CS+(Cloud+Computing)+%E2%80%94+University+of+Bahrain" alt="What I do" />

</div>

---

```console
➜  ~ whoami --verbose
```

I write software end to end, then I write the infrastructure that runs it.

Most of my repos come in pairs: an application, and the pipeline, cluster or hardened box that actually puts it in front of users. I like the part of the job where a working prototype has to survive a deployment.

```jsonc
{
  "name":      "Abdulla Alasmawi",
  "alias":     "Yi",
  "location":  "Kingdom of Bahrain",
  "degree":    "BSc Computer Science — Cloud Computing, University of Bahrain",
  "training":  "Reboot01 / 01Edu — Cloud DevOps specialization",
  "languages": ["Go", "Rust", "Python", "JavaScript", "Shell", "HCL"],
  "studying":  "AWS Solutions Architect Associate (SAA-C03)",
  "speaks":    ["العربية", "English"],
  "site":      "https://alasmawi.dev"
}
```

---

## 🧭 One backend, five ways to ship it

A single microservices backend, deployed five different ways — each repo is the same system one rung further up the ladder.

<div align="center">

```mermaid
graph LR
    A["🐍 crud-master<br/><sub>Flask · RabbitMQ · Vagrant</sub>"]
    B["🐳 play-with-containers<br/><sub>6 images · compose</sub>"]
    C["☸️ orchestrator<br/><sub>K3s · StatefulSets · HPA</sub>"]
    D["☁️ cloud-design<br/><sub>ECS Fargate · RDS · Terraform</sub>"]
    E["🔁 code-keeper<br/><sub>GitLab · Ansible · CI/CD</sub>"]
    A --> B --> C --> D --> E
    style A fill:#0b1219,stroke:#22d3ee,color:#e2e8f0
    style B fill:#0b1219,stroke:#22d3ee,color:#e2e8f0
    style C fill:#0b1219,stroke:#5eead4,color:#e2e8f0
    style D fill:#0b1219,stroke:#818cf8,color:#e2e8f0
    style E fill:#0b1219,stroke:#818cf8,color:#e2e8f0
```

</div>

| Stage | Repo | What it proves |
|---|---|---|
| **1 — Build** | [`crud-master`](https://github.com/Alasmawi/crud-master) | Flask CRUD API, RabbitMQ billing consumer, API gateway across three VMs |
| **2 — Containerize** | [`play-with-containers`](https://github.com/Alasmawi/play-with-containers) | Six purpose-built `debian-slim` images, one network, three volumes — no base-image shortcuts |
| **3 — Orchestrate** | [`orchestrator`](https://github.com/Alasmawi/orchestrator) | 2-node K3s cluster: StatefulSets, HPAs, secrets from `.env`, one script end to end |
| **4 — Go to cloud** | [`cloud-design`](https://github.com/Alasmawi/cloud-design) | Terraform on AWS: ECS Fargate, RDS, Amazon MQ, ALB — only the load balancer is public |
| **5 — Automate** | [`code-keeper`](https://github.com/Alasmawi/code-keeper) | Self-hosted GitLab deployed by Ansible, with app and infra pipeline templates |

---

## 🚀 Selected work

<table>
<tr>
<td width="50%" valign="top">

### [🧠 guidely](https://github.com/Alasmawi/guidely)
Retrieval-augmented internal knowledge assistant with verified citations — FastAPI + FAISS + sentence-transformers, running against local Ollama or OpenAI. **264 tests.**

`Python` `FastAPI` `FAISS` `RAG`

</td>
<td width="50%" valign="top">

### [👁️ detecto](https://github.com/Alasmawi/detecto)
Person detection and counting service: YOLOv8 on CPU behind FastAPI, SQLite store, React frontend. **91.55% accuracy, 108 ms mean inference, 129 tests.**

`Python` `YOLOv8` `React` `FastAPI`

</td>
</tr>
<tr>
<td width="50%" valign="top">

### [💣 bomberman-dom](https://github.com/Alasmawi/bomberman-dom)
Real-time multiplayer Bomberman — WebSocket-authoritative server, DOM renderer, built on my own framework rather than React.

`JavaScript` `WebSockets` `Game loop`

</td>
<td width="50%" valign="top">

### [🁢 mini-framework](https://github.com/Alasmawi/mini-framework)
**Domino** — a dependency-free JS framework: virtual DOM, delegated events, hash router, observable store, with a TodoMVC example.

`JavaScript` `Virtual DOM` `Zero deps`

</td>
</tr>
<tr>
<td width="50%" valign="top">

### [🌐 localhost](https://github.com/Alasmawi/localhost)
Single-threaded HTTP/1.1 server for Linux built on `epoll` in Rust — no web framework, no async runtime.

`Rust` `epoll` `HTTP/1.1`

</td>
<td width="50%" valign="top">

### [🛡️ deep-in-system](https://github.com/Alasmawi/deep-in-system)
Hardened Ubuntu 24.04 server: unattended install, custom partitioning, SSH lockdown, default-deny firewall, chrooted FTP, WordPress + nightly backups.

`Shell` `Linux` `Hardening`

</td>
</tr>
</table>

<details>
<summary><b>More — Rust systems, Go services, and the rest</b></summary>

<br/>

| Repo | Language | What it is |
|---|---|---|
| [`Brain-Book`](https://github.com/Alasmawi/Brain-Book) | Go | Full-stack social network — flagship application build |
| [`real-time-forum`](https://github.com/Alasmawi/real-time-forum) | Go | Forum with live posting and private messaging |
| [`Net-Cat`](https://github.com/Alasmawi/Net-Cat) | Go | TCP chat server in the spirit of classic Unix netcat/talk |
| [`groupie-tracker`](https://github.com/Alasmawi/groupie-tracker) | Go | REST-consuming web app for bands, members and tour dates |
| [`0-shell`](https://github.com/Alasmawi/0-shell) | Rust | Minimalist Unix-like shell with no external command execution |
| [`rt`](https://github.com/Alasmawi/rt) | Rust | Dependency-free Whitted-style ray tracer → PPM output |
| [`smart-road`](https://github.com/Alasmawi/smart-road) | Rust | SDL2 simulation: autonomous vehicles crossing via reservation scheduling |
| [`multiplayer-fps`](https://github.com/Alasmawi/multiplayer-fps) | Rust | Multiplayer first-person shooter |
| [`deep-in-net`](https://github.com/Alasmawi/deep-in-net) | — | Networking fundamentals: switching, DHCP/DNS/HTTP/FTP, routing, subnetting |
| [`make-your-game`](https://github.com/Alasmawi/make-your-game) | JavaScript | Browser game, paired project |
| [`portfolio`](https://github.com/Alasmawi/portfolio) | JavaScript | Source for [alasmawi.dev](https://alasmawi.dev) |

Plus piscine collections in [Rust](https://github.com/Alasmawi/piscine-rust), [JavaScript](https://github.com/Alasmawi/piscine-js), [Go](https://github.com/Alasmawi/bh-piscine) and [Shell](https://github.com/Alasmawi/piscine-scripting).

</details>

---

## 🛠️ Stack

<div align="center">

**Languages**

<img src="https://skillicons.dev/icons?i=go,rust,python,js,ts,bash&theme=dark" alt="Languages" />

**Application**

<img src="https://skillicons.dev/icons?i=react,nodejs,flask,fastapi,postgres,mysql,sqlite,redis&theme=dark" alt="Application stack" />

**Infrastructure**

<img src="https://skillicons.dev/icons?i=docker,kubernetes,terraform,ansible,aws,linux,nginx,gitlab,githubactions,vagrant&theme=dark" alt="Infrastructure stack" />

<br/>

<img src="https://img.shields.io/badge/RabbitMQ-0b1219?style=flat-square&logo=rabbitmq&logoColor=22d3ee" />
<img src="https://img.shields.io/badge/K3s-0b1219?style=flat-square&logo=k3s&logoColor=5eead4" />
<img src="https://img.shields.io/badge/ECS_Fargate-0b1219?style=flat-square&logo=amazonecs&logoColor=818cf8" />
<img src="https://img.shields.io/badge/YOLOv8-0b1219?style=flat-square&logo=pytorch&logoColor=22d3ee" />
<img src="https://img.shields.io/badge/FAISS-0b1219?style=flat-square&logo=meta&logoColor=5eead4" />
<img src="https://img.shields.io/badge/Microsoft_Entra_ID-0b1219?style=flat-square&logo=microsoftazure&logoColor=818cf8" />
<img src="https://img.shields.io/badge/Intune-0b1219?style=flat-square&logo=microsoft&logoColor=22d3ee" />
<img src="https://img.shields.io/badge/SDL2-0b1219?style=flat-square&logo=libretro&logoColor=5eead4" />

</div>

---

## 📊 GitHub in numbers

<div align="center">

<img height="165" src="https://github-readme-stats.vercel.app/api?username=Alasmawi&show_icons=true&hide_border=true&bg_color=0b1219&title_color=22d3ee&icon_color=5eead4&text_color=cbd5e1&include_all_commits=true&rank_icon=github" alt="GitHub stats" />
<img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/?username=Alasmawi&layout=compact&hide_border=true&bg_color=0b1219&title_color=22d3ee&text_color=cbd5e1&langs_count=8" alt="Top languages" />

<br/>

<img height="165" src="https://github-readme-streak-stats.herokuapp.com/?user=Alasmawi&hide_border=true&background=0b1219&stroke=1b2a35&ring=22d3ee&fire=818cf8&currStreakLabel=5eead4&sideLabels=cbd5e1&currStreakNum=ffffff&sideNums=ffffff&dates=64748b" alt="Streak" />

<br/><br/>

<img src="https://github-profile-trophy.vercel.app/?username=Alasmawi&theme=darkhub&no-frame=true&no-bg=true&column=7&margin-w=8&margin-h=8" alt="Trophies" />

<br/>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Alasmawi/Alasmawi/output/github-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Alasmawi/Alasmawi/output/github-snake.svg" />
  <img alt="Contribution snake" src="https://raw.githubusercontent.com/Alasmawi/Alasmawi/output/github-snake.svg" />
</picture>

<br/>

<img src="https://github-readme-activity-graph.vercel.app/graph?username=Alasmawi&bg_color=0b1219&color=22d3ee&line=5eead4&point=818cf8&area=true&area_color=22d3ee&hide_border=true" alt="Activity graph" width="100%" />

</div>

---

## 📡 Currently

```console
➜  ~ tail -f ~/now.log
[ studying ] AWS Solutions Architect Associate — SAA-C03
[ building ] Cloud DevOps track @ Reboot01 — CI/CD, containers, observability
[ writing  ] Enterprise identity & endpoint management documentation (Entra ID, Intune)
[ open to  ] Full-stack, platform and cloud engineering roles — Bahrain & the GCC
```

<div align="center">

<br/>

<a href="https://alasmawi.dev"><img src="https://img.shields.io/badge/Let's_build_something-22d3ee?style=for-the-badge&labelColor=0b1219" alt="Contact" /></a>
<a href="mailto:alasmawiabdulla0@gmail.com"><img src="https://img.shields.io/badge/Get_in_touch-818cf8?style=for-the-badge&labelColor=0b1219" alt="Email" /></a>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&height=120&color=0:22d3ee,50:5eead4,100:818cf8&section=footer" width="100%" alt="" />

</div>
