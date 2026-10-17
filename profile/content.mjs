// Every word on the profile lives here, kept in step with alasmawi.dev
// (src/data/*.js in the portfolio repo) so the two can't tell different stories.
//
// Copy rules, same as the site: no slash-separated titles, no noun stacks, no
// "robust" or "seamless". Plain first-person sentences about what was built.

export const USER = 'Alasmawi';

export const PERSON = {
  first: 'Abdulla',
  last: 'Alasmawi',
  line: 'Software engineer working across full-stack development and AWS.',
  place: 'Manama, Bahrain',
  tz: 'UTC+3',
  site: 'https://alasmawi.dev',
  email: 'alasmawiabdulla0@gmail.com',
  linkedin: 'https://www.linkedin.com/in/alasmawi',
  cv: 'https://alasmawi.dev/cv',
};

export const LINKS = [
  { id: 'portfolio', label: 'alasmawi.dev', href: PERSON.site, primary: true },
  { id: 'email', label: 'Email', href: `mailto:${PERSON.email}` },
  { id: 'linkedin', label: 'LinkedIn', href: PERSON.linkedin },
  { id: 'cv', label: 'CV', href: PERSON.cv },
];

// Typed out in the terminal card, in this order.
export const ABOUT = [
  { cmd: 'whoami' },
  { out: 'Abdulla Alasmawi, software engineer in Manama, Bahrain (UTC+3)' },
  { cmd: 'cat about.txt' },
  {
    out: [
      'I work across the stack, from the data model and API to the interface and the deployment.',
      'At the AWS Cloud Innovation Center I built a serverless monitoring platform for the Ministry of Interior Police K9 Unit.',
      'At the Bahrain Shura Council I built Bayyan, a bilingual obligations register piloted across four teams, and moved a production database from Amazon RDS to on-premises servers with no data lost.',
    ],
  },
  { cmd: 'cat profile.json' },
  {
    json: [
      ['degree', 'B.Sc. Computer Science, cloud computing track'],
      ['school', 'University of Bahrain'],
      ['program', 'Full Stack Development, DevOps specialization'],
      ['writes', ['Go', 'Rust', 'Python', 'TypeScript', 'JavaScript', 'Shell']],
      ['speaks', ['Arabic', 'English']],
      ['looking_for', 'a role on a product team'],
    ],
  },
];

export const PILLARS = [
  {
    title: 'Full-stack products',
    body: 'Interface, API, data model and deployment, designed and delivered as one piece of work.',
    items: ['Bayyan', 'Brain-Book', 'K9 dashboard'],
  },
  {
    title: 'Cloud on AWS',
    body: 'Serverless backends and IoT ingestion on AWS, and moving production systems between AWS and on-premises servers.',
    items: ['K9 backend', 'RDS to on-prem', 'DRS replication fix'],
  },
  {
    title: 'Applied AI',
    body: 'Retrieval, detection and anomaly flagging built into products, with the supporting evidence shown to the user.',
    items: ['Guidely', 'Detecto', 'Bedrock in K9'],
  },
  {
    title: 'Systems programming',
    body: 'An HTTP server on epoll, a Unix shell and a ray tracer, each written without a framework.',
    items: ['localhost', '0-shell', 'rt'],
  },
];

export const FEATURED = [
  {
    id: 'k9',
    name: 'K9 Pavlov System',
    context: 'Ministry of Interior Police K9 Unit',
    summary:
      'One place to see each police dog’s health, the conditions in its kennel and who is assigned to it, replacing paper records and separate checks.',
    proof: ['ESP32 collar to AWS IoT Core', 'Bedrock care guidance', 'Demonstrated live to the MoI'],
    tags: ['AWS IoT Core', 'Lambda', 'DynamoDB', 'Amazon Bedrock', 'Cognito'],
    href: 'https://pavlov-k9.com/',
    cta: 'pavlov-k9.com',
  },
  {
    id: 'bayyan',
    name: 'Bayyan',
    context: 'Bahrain Shura Council',
    summary:
      'One register of everything the security department owns, owes and needs to renew, flagging each renewal before it lapses.',
    proof: ['English and Arabic, right to left', 'Bills read from PDF, traced to source', 'Piloted across 4 teams'],
    tags: ['NestJS', 'Prisma', 'React', 'PostgreSQL', 'MinIO', 'nginx'],
    href: 'https://alasmawi.dev/#projects',
    cta: 'case study',
  },
  {
    id: 'guidely',
    name: 'Guidely',
    context: 'Internal knowledge assistant',
    summary:
      'Answers questions about a team’s own documents in a sentence, and shows the exact passages each answer came from.',
    proof: ['94% retrieval hit rate', '264 automated tests', 'Runs fully local'],
    tags: ['Python', 'FastAPI', 'FAISS', 'sentence-transformers', 'Ollama'],
    href: 'https://github.com/Alasmawi/guidely',
    cta: 'Alasmawi/guidely',
  },
  {
    id: 'brainbook',
    name: 'Brain-Book',
    context: 'Reboot01 · peer-audited',
    summary: 'A social platform where people post, join groups, share photos and message each other instantly.',
    proof: ['React, Go and a REST API', 'WebSockets for live delivery', 'Defended in a live audit'],
    tags: ['Go', 'React', 'WebSockets', 'SQLite'],
    href: 'https://github.com/Alasmawi/Brain-Book',
    cta: 'Alasmawi/Brain-Book',
  },
  {
    id: 'detecto',
    name: 'Detecto',
    context: 'Computer vision',
    summary: 'Counts the people in an image, a video or a live webcam feed, and keeps every run for review.',
    proof: ['YOLOv8 behind FastAPI', 'Zone alerts', 'CSV and Excel export'],
    tags: ['Python', 'FastAPI', 'YOLOv8', 'OpenCV', 'React'],
    href: 'https://github.com/Alasmawi/detecto',
    cta: 'Alasmawi/detecto',
  },
];

// 2026, drawn on a month axis. `end: null` runs to the build date.
export const EXPERIENCE = [
  {
    id: 'cic',
    role: 'Cloud & IoT Intern',
    org: 'AWS Cloud Innovation Center',
    start: '2026-02-01',
    end: '2026-06-30',
    color: '#F2A93B',
    built: 'K9 Pavlov System',
    points: [
      'Built the Ministry of Interior Police K9 Unit’s monitoring platform end to end: the dashboard, the serverless backend, and the ingestion pipeline between them.',
      'Designed the backend on AWS: IoT Core and API Gateway take the data in, Lambda processes it, DynamoDB stores it, and Cognito keeps handlers and kennel staff to their own views.',
      'Wired in Amazon Bedrock to flag sensor anomalies and turn them into plain care recommendations on the dashboard.',
      'Demonstrated the finished system live to AWS mentors and Ministry of Interior stakeholders.',
    ],
  },
  {
    id: 'shura',
    role: 'Network & Information Security Intern',
    org: 'Bahrain Shura Council',
    start: '2026-07-01',
    end: null,
    color: '#CE1126',
    built: 'Bayyan',
    points: [
      'Built Bayyan, the department’s bilingual English and Arabic register of its telecom, permit, contract and subscription obligations: a NestJS and Prisma API, a React front end and PostgreSQL, deployed on Linux behind nginx.',
      'Moved a production MariaDB database off Amazon RDS to on-premises servers through an S3 snapshot, and sequenced the cutover so the restored copy matched the source with no data lost.',
      'Traced a kernel version incompatibility that stopped the AWS Elastic Disaster Recovery agent from replicating a production EC2 instance from Ireland to Frankfurt, and worked the case with AWS Support until the agent installed.',
      'Support staff with network, endpoint and infrastructure issues; run account lifecycle across Active Directory, Entra ID and Intune; and roll out PAM, BitLocker encryption policy and ManageEngine patching across the fleet.',
      'Write the technical documentation and step-by-step procedures the department works from after handover.',
    ],
  },
];

export const EDUCATION = [
  {
    short: 'UoB',
    school: 'University of Bahrain',
    degree: 'B.Sc. Computer Science',
    track: 'Cloud computing',
    from: 2022,
    to: 2026,
    color: '#C9A227',
    stat: ['132', 'credit hours'],
  },
  {
    short: 'Reboot01',
    school: 'Reboot Coding Institute',
    degree: 'Full Stack Development',
    track: 'DevOps specialization',
    from: 2024,
    to: 2026,
    color: '#1CCFC9',
    stat: ['24', 'months'],
    phases: [
      { name: 'Common Core', months: 18 },
      { name: 'DevOps', months: 6, active: true },
    ],
  },
];

// One microservices backend, deployed five ways. Facts and statuses come from
// each repo's own "What's verified, and what isn't" section; keep them honest.
//
// status.level: 'verified' (ran end to end), 'partial' (some of it ran),
// 'validated' (checked without running).
export const LADDER = [
  {
    n: '01', verb: 'Build', repo: 'crud-master', stack: 'Flask · RabbitMQ · Vagrant',
    proves: 'A Flask CRUD API and a RabbitMQ billing consumer behind an API gateway, across three VMs.',
    delta: 'Three services, each in its own Vagrant VM. The gateway never calls billing directly: it publishes to RabbitMQ, so orders are accepted even while billing is down.',
    entry: 'client -> gateway-vm :3000',
    facts: ['newman: 18/18 assertions pass', 'queue holds orders while billing-app is stopped', 'apps kept alive by PM2'],
    status: { label: 'verified', level: 'verified' },
  },
  {
    n: '02', verb: 'Containerize', repo: 'play-with-containers', stack: 'Docker · Compose',
    proves: 'Six images built from debian-slim by hand, one network, three volumes.',
    delta: 'The same code in six images, each built from bare debian-slim: no official postgres or rabbitmq images. One bridge network, three volumes, and only the gateway published.',
    entry: 'host :3000, the only published port',
    facts: ['all six images build from debian-slim', 'full request flow through the gateway', 'killed containers restart on their own'],
    status: { label: 'verified', level: 'verified' },
  },
  {
    n: '03', verb: 'Orchestrate', repo: 'orchestrator', stack: 'K3s · StatefulSets · HPA',
    proves: 'A two-node K3s cluster with StatefulSets and autoscaling, stood up by one script.',
    delta: 'A two-node K3s cluster run by one script. Databases become StatefulSets with their own volumes, the gateway and inventory scale from 1 to 3 on CPU, and secrets come from .env at deploy time.',
    entry: 'NodePort 30000 -> 3000',
    facts: ['full request flow on a k3d cluster', 'HPAs reading real CPU metrics', 'PVCs bound and reattached'],
    status: { label: 'verified on k3d', level: 'partial' },
  },
  {
    n: '04', verb: 'Go to cloud', repo: 'cloud-design', stack: 'Terraform · ECS Fargate · RDS',
    proves: 'Terraform for AWS: ECS Fargate, RDS, Amazon MQ and an ALB, which is the only public piece. Validated, not applied.',
    delta: 'Terraform for AWS: Fargate tasks in private subnets, RDS for both databases, Amazon MQ for the queue. The load balancer is the only thing with a route from the internet.',
    entry: 'ALB in the public subnet',
    facts: ['terraform fmt, init and validate pass', 'security groups chained ALB -> tasks -> data', 'plan and apply not run: no AWS account'],
    status: { label: 'validated, not applied', level: 'validated' },
  },
  {
    n: '05', verb: 'Automate', repo: 'code-keeper', stack: 'GitLab · Ansible · CI/CD',
    proves: 'A self-hosted GitLab deployed by Ansible, with pipeline templates for the app and the infrastructure.',
    delta: 'A self-hosted GitLab stood up by Ansible, and the pipelines that ship the rest: build, test and scan on every push, with a manual approval before production for both the apps and the infrastructure.',
    entry: 'push to a protected branch',
    facts: ['GitLab CE 19.2.0 brought up by the playbook', 'playbook caught and fixed a real config bug', 'pipelines not yet run end to end'],
    status: { label: 'playbook run', level: 'partial' },
  },
];

// What changed rung by rung, one row per concern.
export const EVOLUTION = [
  ['runs on', ['3 Vagrant VMs, apps under PM2', '6 containers built from debian-slim', '2-node K3s, master and agent', 'ECS Fargate tasks in a VPC', 'GitLab CI on a Docker runner']],
  ['way in', ['gateway-vm on :3000', 'host :3000, nothing else published', 'NodePort 30000 to 3000', 'an ALB, the only public resource', 'deploys from protected branches only']],
  ['state', ['PostgreSQL on each VM', 'named volumes for both databases', 'StatefulSets with 1Gi PVCs', 'two RDS PostgreSQL instances', 'plan, approve, apply per environment']],
  ['queue', ['RabbitMQ on billing-vm', 'rabbit-queue container', 'RabbitMQ Deployment', 'Amazon MQ, RabbitMQ engine, TLS', 'images pushed to the GitLab registry']],
  ['secrets', ['.env forwarded by Vagrant', '.env injected by Compose', '.env turned into k8s Secrets', 'random_password into Secrets Manager', 'masked, protected CI variables']],
  ['scaling', ['none; PM2 restarts crashes', 'restart: unless-stopped', 'HPA 1 to 3 at 60% CPU', 'Application Auto Scaling 1 to 3', 'manual approval before production']],
];

// The "more projects" explorer, same order and words as the site.
export const MORE = [
  { name: 'localhost', lang: 'Rust', what: 'HTTP/1.1 server on epoll, no framework, no async runtime' },
  { name: '0-shell', lang: 'Rust', what: 'Unix shell with its own built-in commands' },
  { name: 'rt', lang: 'Rust', what: 'ray tracer from first principles' },
  { name: 'smart-road', lang: 'Rust', what: 'traffic simulation without signals' },
  { name: 'multiplayer-fps', lang: 'Rust', what: 'networked first-person shooter' },
  { name: 'bomberman-dom', lang: 'JavaScript', what: 'real-time multiplayer, no game engine' },
  { name: 'mini-framework', lang: 'JavaScript', what: 'Domino, a JS framework from scratch' },
  { name: 'real-time-forum', lang: 'Go', what: 'forum with live private chat' },
  { name: 'Net-Cat', lang: 'Go', what: 'TCP chat server, netcat-style' },
  { name: 'groupie-tracker', lang: 'Go', what: 'server-rendered REST client' },
  { name: 'deep-in-system', lang: 'Shell', what: 'a hardened Ubuntu server, built from an unattended install' },
];

export const STACK = [
  { group: 'Languages', icons: ['go', 'rust', 'python', 'typescript', 'javascript', 'gnubash'] },
  { group: 'Product', icons: ['react', 'nestjs', 'nodedotjs', 'fastapi', 'flask', 'prisma'] },
  { group: 'Data', icons: ['postgresql', 'mariadb', 'sqlite', 'redis', 'minio', 'rabbitmq'] },
  { group: 'Infrastructure', icons: ['docker', 'kubernetes', 'k3s', 'terraform', 'ansible', 'githubactions', 'gitlab', 'nginx', 'linux', 'vagrant'] },
  { group: 'Applied AI', icons: ['pytorch', 'opencv', 'ollama'], chips: ['FAISS', 'YOLOv8', 'Bedrock'] },
  { group: 'AWS', chips: ['IoT Core', 'Lambda', 'DynamoDB', 'API Gateway', 'Cognito', 'ECS Fargate', 'RDS', 'S3', 'Elastic Disaster Recovery'] },
  { group: 'Identity & endpoint', chips: ['Active Directory', 'Entra ID', 'Intune', 'BitLocker', 'ManageEngine'] },
];

// [tag, what, since]
export const NOW = [
  ['role', 'Network & Information Security Intern, Bahrain Shura Council', '2026-07'],
  ['building', 'Bayyan, the department’s bilingual obligations register', '2026-07'],
  ['studying', 'AWS Solutions Architect Associate (SAA-C03)', '2026'],
  ['program', 'Reboot Coding Institute, DevOps specialization', '2024'],
  ['open to', 'a role on a product team, in Bahrain and the GCC', 'now'],
];
