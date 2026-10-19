<!--
  Generated file. Edit profile/README.template.md and profile/content.mjs,
  then run `npm run build`. The scheduled Action rebuilds this twice a day.
-->

<div align="center">

<a href="https://alasmawi.dev"><img src="./assets/generated/hero.svg" width="100%" alt="Abdulla Alasmawi. Software engineer working across full-stack development and AWS. Based in Manama, Bahrain." /></a>

<br/>

<a href="https://alasmawi.dev"><img src="./assets/generated/btn-portfolio.svg" height="46" alt="alasmawi.dev" /></a>&nbsp;<a href="mailto:alasmawiabdulla0@gmail.com"><img src="./assets/generated/btn-email.svg" height="46" alt="Email" /></a>&nbsp;<a href="https://www.linkedin.com/in/alasmawi"><img src="./assets/generated/btn-linkedin.svg" height="46" alt="LinkedIn" /></a>&nbsp;<a href="https://alasmawi.dev/cv"><img src="./assets/generated/btn-cv.svg" height="46" alt="CV" /></a>

<br/><br/>

<img src="./assets/generated/about.svg" width="100%" alt="01 · About. A terminal session: whoami, cat about.txt and cat profile.json." />

<br/><br/>

<img src="./assets/generated/focus.svg" width="100%" alt="02 · What I do. Full-stack products, cloud on AWS, applied AI and systems programming." />

<br/><br/>

<img src="./assets/generated/h-work.svg" width="100%" alt="03 · Selected work" />

<a href="https://pavlov-k9.com/"><img src="./assets/generated/work-k9.svg" width="100%" alt="K9 Pavlov System: One place to see each police dog’s health, the conditions in its kennel and who is assigned to it, replacing paper records and separate checks." /></a>
<br/><br/>
<a href="https://alasmawi.dev/#projects"><img src="./assets/generated/work-bayyan.svg" width="100%" alt="Bayyan: One register of everything the security department owns, owes and needs to renew, flagging each renewal before it lapses." /></a>
<br/><br/>
<a href="https://github.com/Alasmawi/guidely"><img src="./assets/generated/work-guidely.svg" width="100%" alt="Guidely: Answers questions about a team’s own documents in a sentence, and shows the exact passages each answer came from." /></a>
<br/><br/>
<a href="https://github.com/Alasmawi/Brain-Book"><img src="./assets/generated/work-brainbook.svg" width="100%" alt="Brain-Book: A social platform where people post, join groups, share photos and message each other instantly." /></a>
<br/><br/>
<a href="https://github.com/Alasmawi/detecto"><img src="./assets/generated/work-detecto.svg" width="100%" alt="Detecto: Counts the people in an image, a video or a live webcam feed, and keeps every run for review." /></a>

<br/><br/>

<img src="./assets/generated/ladder.svg" width="100%" alt="04 · Five ways to ship. One backend drawn as five isometric platforms, one per deployment." />

<br/><br/>

<a href="https://github.com/Alasmawi/crud-master"><img src="./assets/generated/rung-01.svg" width="100%" alt="01 Build, crud-master: Three services, each in its own Vagrant VM. The gateway never calls billing directly: it publishes to RabbitMQ, so orders are accepted even while billing is down. Status: verified." /></a>
<br/><br/>
<a href="https://github.com/Alasmawi/play-with-containers"><img src="./assets/generated/rung-02.svg" width="100%" alt="02 Containerize, play-with-containers: The same code in six images, each built from bare debian-slim: no official postgres or rabbitmq images. One bridge network, three volumes, and only the gateway published. Status: verified." /></a>
<br/><br/>
<a href="https://github.com/Alasmawi/orchestrator"><img src="./assets/generated/rung-03.svg" width="100%" alt="03 Orchestrate, orchestrator: A two-node K3s cluster run by one script. Databases become StatefulSets with their own volumes, the gateway and inventory scale from 1 to 3 on CPU, and secrets come from .env at deploy time. Status: verified on k3d." /></a>
<br/><br/>
<a href="https://github.com/Alasmawi/cloud-design"><img src="./assets/generated/rung-04.svg" width="100%" alt="04 Go to cloud, cloud-design: Terraform for AWS: Fargate tasks in private subnets, RDS for both databases, Amazon MQ for the queue. The load balancer is the only thing with a route from the internet. Status: validated, not applied." /></a>
<br/><br/>
<a href="https://github.com/Alasmawi/code-keeper"><img src="./assets/generated/rung-05.svg" width="100%" alt="05 Automate, code-keeper: A self-hosted GitLab stood up by Ansible, and the pipelines that ship the rest: build, test and scan on every push, with a manual approval before production for both the apps and the infrastructure. Status: playbook run." /></a>

<br/><br/>

<img src="./assets/generated/evolution.svg" width="100%" alt="What changed at each rung: where it runs, the way in, state, the queue, secrets and scaling." />

<br/><br/>

<img src="./assets/generated/experience.svg" width="100%" alt="05 · Experience. A 2026 timeline: AWS Cloud Innovation Center from February to June, then Bahrain Shura Council from July to today." />

</div>

<details>
<summary><b>Network & Information Security Intern</b> · Bahrain Shura Council</summary>
<br/>

- Built Bayyan, the department’s bilingual English and Arabic register of its telecom, permit, contract and subscription obligations: a NestJS and Prisma API, a React front end and PostgreSQL, deployed on Linux behind nginx.
- Moved a production MariaDB database off Amazon RDS to on-premises servers through an S3 snapshot, and sequenced the cutover so the restored copy matched the source with no data lost.
- Traced a kernel version incompatibility that stopped the AWS Elastic Disaster Recovery agent from replicating a production EC2 instance from Ireland to Frankfurt, and worked the case with AWS Support until the agent installed.
- Support staff with network, endpoint and infrastructure issues; run account lifecycle across Active Directory, Entra ID and Intune; and roll out PAM, BitLocker encryption policy and ManageEngine patching across the fleet.
- Write the technical documentation and step-by-step procedures the department works from after handover.

</details>

<details>
<summary><b>Cloud & IoT Intern</b> · AWS Cloud Innovation Center</summary>
<br/>

- Built the Ministry of Interior Police K9 Unit’s monitoring platform end to end: the dashboard, the serverless backend, and the ingestion pipeline between them.
- Designed the backend on AWS: IoT Core and API Gateway take the data in, Lambda processes it, DynamoDB stores it, and Cognito keeps handlers and kennel staff to their own views.
- Wired in Amazon Bedrock to flag sensor anomalies and turn them into plain care recommendations on the dashboard.
- Demonstrated the finished system live to AWS mentors and Ministry of Interior stakeholders.

</details>

<div align="center">

<br/>

<img src="./assets/generated/education.svg" width="100%" alt="University of Bahrain, 2022 to 2026, alongside Reboot Coding Institute, 2024 to 2026." />

<br/><br/>

<img src="./assets/generated/more.svg" width="100%" alt="06 · More projects. A file listing of eleven more repositories." />

<sub>[`localhost`](https://github.com/Alasmawi/localhost) · [`0-shell`](https://github.com/Alasmawi/0-shell) · [`rt`](https://github.com/Alasmawi/rt) · [`smart-road`](https://github.com/Alasmawi/smart-road) · [`multiplayer-fps`](https://github.com/Alasmawi/multiplayer-fps) · [`bomberman-dom`](https://github.com/Alasmawi/bomberman-dom) · [`mini-framework`](https://github.com/Alasmawi/mini-framework) · [`real-time-forum`](https://github.com/Alasmawi/real-time-forum) · [`Net-Cat`](https://github.com/Alasmawi/Net-Cat) · [`groupie-tracker`](https://github.com/Alasmawi/groupie-tracker) · [`deep-in-system`](https://github.com/Alasmawi/deep-in-system)</sub>

<br/><br/>

<img src="./assets/generated/stack.svg" width="100%" alt="07 · Stack. Languages, product, data, infrastructure, applied AI, AWS, and identity and endpoint tooling." />

<br/><br/>

<img src="./assets/generated/telemetry.svg" width="100%" alt="08 · Telemetry. GitHub numbers: contributions, commits, pull requests, streaks and language share, and the last year of contributions as an isometric city." />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/generated/snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="./assets/generated/snake-light.svg" />
  <img src="./assets/generated/snake-dark.svg" width="100%" alt="The contribution graph being eaten by a snake." />
</picture>

<br/><br/>

<img src="./assets/generated/now.svg" width="100%" alt="What I'm doing now." />

<br/><br/>

<a href="mailto:alasmawiabdulla0@gmail.com"><img src="./assets/generated/footer.svg" width="100%" alt="Let's build something. alasmawiabdulla0@gmail.com" /></a>

<sub>Every image above is generated by <a href="./profile"><code>profile/</code></a>, a dependency-free Node build, and redrawn by <a href="./.github/workflows/profile.yml">a scheduled Action</a>. Last build: 2026-10-19 08:49 UTC · 33d4371.</sub>

</div>
