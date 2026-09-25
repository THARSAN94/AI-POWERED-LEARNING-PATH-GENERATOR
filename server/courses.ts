export interface Course {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  icon: string;
  estimatedHours: number;
  featured?: boolean;
  tags: string[];
  prerequisites: string[];
  syllabusOverview: string[];
}

export const COURSES: Course[] = [
  // 1. Web Development & Frontend
  {
    id: 'fullstack-react-mastery',
    title: 'Modern React & Full-Stack Architecture',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Master React 19, hooks, concurrent rendering, state machines, server components, and enterprise full-stack development.',
    icon: 'Atom',
    estimatedHours: 60,
    featured: true,
    tags: ['React', 'TypeScript', 'Next.js', 'Web'],
    prerequisites: ['HTML/CSS', 'Basic JavaScript ES6'],
    syllabusOverview: ['Component Architecture & State', 'React 19 Hooks & Server Actions', 'Performance Optimization', 'Full-Stack Integration & Testing']
  },
  {
    id: 'modern-javascript-deep-dive',
    title: 'Modern JavaScript (ES6+ to ESNext)',
    category: 'Web Development',
    level: 'Beginner',
    description: 'Deep dive into closures, prototypes, event loops, async/await, generators, memory management, and modern Web APIs.',
    icon: 'FileCode2',
    estimatedHours: 45,
    featured: true,
    tags: ['JavaScript', 'ES6', 'DOM', 'Async'],
    prerequisites: ['Basic programming understanding'],
    syllabusOverview: ['Execution Context & Closures', 'Prototypes & OOP', 'Asynchronous JS & Microtasks', 'Modern Web APIs & Bundlers']
  },
  {
    id: 'typescript-enterprise-patterns',
    title: 'TypeScript for Enterprise Applications',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'From advanced types and generics to AST transformers, decorators, and scalable design patterns.',
    icon: 'ShieldCheck',
    estimatedHours: 50,
    tags: ['TypeScript', 'Static Analysis', 'Architecture'],
    prerequisites: ['JavaScript ES6+'],
    syllabusOverview: ['Type System Fundamentals', 'Generics & Conditional Types', 'Design Patterns in TS', 'Monorepo & Strict Configuration']
  },
  {
    id: 'nextjs-production-mastery',
    title: 'Next.js 15 & Server Components',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Build lightning-fast web applications using Next.js App Router, streaming SSR, ISR, and edge middleware.',
    icon: 'Globe',
    estimatedHours: 55,
    tags: ['Next.js', 'React', 'SSR', 'Edge'],
    prerequisites: ['React Fundamentals'],
    syllabusOverview: ['App Router & Layouts', 'Server & Client Components', 'Data Fetching & Cache', 'Deployment & Edge Runtimes']
  },
  {
    id: 'vuejs-complete-guide',
    title: 'Vue.js 3 & Pinia Architecture',
    category: 'Web Development',
    level: 'Beginner',
    description: 'Comprehensive guide to Composition API, reactive primitives, Pinia state management, and Vue Router.',
    icon: 'Code2',
    estimatedHours: 40,
    tags: ['Vue', 'Pinia', 'Vite', 'Frontend'],
    prerequisites: ['HTML, CSS, JavaScript'],
    syllabusOverview: ['Composition API & Reactivity', 'Component Design', 'Pinia State Stores', 'Unit Testing with Vitest']
  },
  {
    id: 'angular-enterprise-architect',
    title: 'Angular 18 Enterprise Framework',
    category: 'Web Development',
    level: 'Advanced',
    description: 'Signals, standalone components, RxJS reactive pipelines, dependency injection, and scalable enterprise architecture.',
    icon: 'Layers',
    estimatedHours: 65,
    tags: ['Angular', 'RxJS', 'TypeScript', 'Enterprise'],
    prerequisites: ['TypeScript', 'OOP concepts'],
    syllabusOverview: ['Angular Signals & Hydration', 'RxJS Operators & State', 'Guards & Resolvers', 'Enterprise Microfrontends']
  },
  {
    id: 'tailwind-responsive-ui-mastery',
    title: 'Modern UI/UX & Tailwind CSS Systems',
    category: 'Web Development',
    level: 'Beginner',
    description: 'Design production design systems, fluid layouts, dark modes, animations, and accessible components.',
    icon: 'Palette',
    estimatedHours: 35,
    tags: ['CSS', 'Tailwind', 'Design Systems', 'A11y'],
    prerequisites: ['HTML basics'],
    syllabusOverview: ['Flexbox & Grid Systems', 'Design Tokens & Config', 'Micro-interactions & Keyframes', 'WCAG AA Accessibility']
  },

  // 2. Programming Languages
  {
    id: 'java-backend-spring-boot',
    title: 'Java 21 & Spring Boot Microservices',
    category: 'Programming',
    level: 'Intermediate',
    description: 'Modern Java features (Virtual Threads, Pattern Matching), Spring Boot 3, Hibernate JPA, REST APIs, and event-driven architecture.',
    icon: 'Coffee',
    estimatedHours: 70,
    featured: true,
    tags: ['Java', 'Spring Boot', 'Microservices', 'JPA'],
    prerequisites: ['Basic object-oriented programming'],
    syllabusOverview: ['Java 21 Core & Records', 'Spring Boot 3 REST & DI', 'Hibernate & Database Transactions', 'Kafka & Cloud Deployment']
  },
  {
    id: 'python-complete-masterclass',
    title: 'Python Core & Advanced Programming',
    category: 'Programming',
    level: 'Beginner',
    description: 'Master Python syntax, data structures, functional paradigms, OOP, memory profiling, and concurrent execution.',
    icon: 'Terminal',
    estimatedHours: 50,
    featured: true,
    tags: ['Python', 'OOP', 'Algorithms', 'Scripting'],
    prerequisites: ['None - complete beginner friendly'],
    syllabusOverview: ['Python Idioms & Data Structures', 'Object-Oriented Design', 'Generators & Decorators', 'Asyncio & Multiprocessing']
  },
  {
    id: 'golang-systems-backend',
    title: 'Go (Golang) Concurrent Systems',
    category: 'Programming',
    level: 'Intermediate',
    description: 'Build resilient high-throughput backends with Goroutines, channels, interfaces, gRPC, and memory-safe systems code.',
    icon: 'Zap',
    estimatedHours: 55,
    tags: ['Go', 'Concurrency', 'Microservices', 'gRPC'],
    prerequisites: ['Any programming language experience'],
    syllabusOverview: ['Go Syntax & Pointers', 'Goroutines & Channels', 'HTTP Servers & Middleware', 'gRPC & High-Load Profiling']
  },
  {
    id: 'rust-systems-engineering',
    title: 'Rust Systems & Memory Safety',
    category: 'Programming',
    level: 'Advanced',
    description: 'Master ownership, borrowing, lifetimes, fearless concurrency, smart pointers, and WebAssembly compilation.',
    icon: 'Cpu',
    estimatedHours: 75,
    tags: ['Rust', 'Systems', 'Wasm', 'Performance'],
    prerequisites: ['C, C++ or strong programming foundation'],
    syllabusOverview: ['Ownership & Borrow Checker', 'Traits & Error Handling', 'Unsafe Rust & Concurrency', 'Building Wasm & CLI Engines']
  },
  {
    id: 'cpp-modern-software-engineering',
    title: 'Modern C++20 Software Engineering',
    category: 'Programming',
    level: 'Advanced',
    description: 'Deep dive into C++20 concepts, ranges, smart pointers, RAII, templates, and low-latency performance tuning.',
    icon: 'Code',
    estimatedHours: 80,
    tags: ['C++', 'Performance', 'Low Level', 'Algorithms'],
    prerequisites: ['C/C++ basics'],
    syllabusOverview: ['RAII & Memory Management', 'C++20 Concepts & Coroutines', 'Template Metaprogramming', 'Cache Locality & Optimization']
  },
  {
    id: 'csharp-dotnet-core',
    title: 'C# 12 & .NET 8 Enterprise Backend',
    category: 'Programming',
    level: 'Intermediate',
    description: 'Build modern cross-platform web APIs, Entity Framework Core ORM, Minimal APIs, and cloud-native solutions.',
    icon: 'Laptop',
    estimatedHours: 60,
    tags: ['C#', '.NET', 'WebAPI', 'Entity Framework'],
    prerequisites: ['Basic programming'],
    syllabusOverview: ['C# 12 Language Innovations', 'ASP.NET Core Minimal APIs', 'Entity Framework Core', 'Clean Architecture & Testing']
  },
  {
    id: 'kotlin-modern-development',
    title: 'Kotlin for Android & Server-Side',
    category: 'Programming',
    level: 'Intermediate',
    description: 'Coroutines, Flow, null safety, domain-specific languages (DSLs), and multiplatform development.',
    icon: 'Smartphone',
    estimatedHours: 50,
    tags: ['Kotlin', 'Android', 'Coroutines', 'KMP'],
    prerequisites: ['Java or OOP basics'],
    syllabusOverview: ['Kotlin Syntax & Null Safety', 'Coroutines & Asynchronous Flow', 'Jetpack Compose Basics', 'Ktor Server-Side Development']
  },
  {
    id: 'swift-ios-app-architecture',
    title: 'Swift & SwiftUI App Development',
    category: 'Programming',
    level: 'Intermediate',
    description: 'Create native iOS applications using Swift 6, SwiftUI, SwiftData, async/await, and MVVM architecture.',
    icon: 'Compass',
    estimatedHours: 55,
    tags: ['Swift', 'iOS', 'SwiftUI', 'Apple'],
    prerequisites: ['Basic programming logic'],
    syllabusOverview: ['Swift Language Essentials', 'SwiftUI Declarative Layouts', 'State Management & SwiftData', 'App Store Readiness']
  },

  // 3. Backend & APIs
  {
    id: 'nodejs-distributed-systems',
    title: 'Node.js & Distributed Backend Architecture',
    category: 'Backend & APIs',
    level: 'Intermediate',
    description: 'Event loop mechanics, stream processing, clustering, worker threads, microservices, and message queues.',
    icon: 'Server',
    estimatedHours: 55,
    featured: true,
    tags: ['Node.js', 'Express', 'Streams', 'Backend'],
    prerequisites: ['JavaScript ES6+'],
    syllabusOverview: ['V8 & Event Loop Internals', 'Node Streams & Buffers', 'Clustering & Child Processes', 'Resilient Microservices with Redis']
  },
  {
    id: 'django-rest-framework-mastery',
    title: 'Python Django & REST Framework',
    category: 'Backend & APIs',
    level: 'Intermediate',
    description: 'Rapid web backend development with Django ORM, authentication, viewsets, caching, Celery async tasks, and Stripe billing.',
    icon: 'LayoutGrid',
    estimatedHours: 55,
    tags: ['Django', 'Python', 'REST', 'Celery'],
    prerequisites: ['Python Basics'],
    syllabusOverview: ['Django Architecture & ORM', 'DRF Serializers & Viewsets', 'JWT Authentication & RBAC', 'Celery Workers & Background Jobs']
  },
  {
    id: 'fastapi-high-performance-apis',
    title: 'FastAPI & Async Python Backends',
    category: 'Backend & APIs',
    level: 'Intermediate',
    description: 'Build blazing-fast Python microservices with Pydantic v2, dependency injection, async database drivers, and OpenAPI.',
    icon: 'Flame',
    estimatedHours: 45,
    tags: ['FastAPI', 'Python', 'Async', 'Pydantic'],
    prerequisites: ['Python basics'],
    syllabusOverview: ['Asyncio & FastAPI Routing', 'Pydantic Schemas & Validation', 'SQLAlchemy 2.0 Async ORM', 'Dockerizing & Benchmarking']
  },
  {
    id: 'graphql-apollo-federation',
    title: 'GraphQL & Apollo Federation Architect',
    category: 'Backend & APIs',
    level: 'Advanced',
    description: 'Design unified supergraphs, GraphQL schema stitching, batching with DataLoader, and subgraphs with Apollo Router.',
    icon: 'Share2',
    estimatedHours: 50,
    tags: ['GraphQL', 'Apollo', 'Microservices', 'APIs'],
    prerequisites: ['REST APIs', 'Node.js or Python'],
    syllabusOverview: ['Schema Definition Language (SDL)', 'Resolvers & N+1 Problem', 'Apollo Federation & Subgraphs', 'Security & Rate Limiting']
  },
  {
    id: 'grpc-protobuf-microservices',
    title: 'gRPC & Protocol Buffers Architecture',
    category: 'Backend & APIs',
    level: 'Advanced',
    description: 'High-speed inter-service communication with Protobuf binary serialization, streaming RPCs, and load balancing.',
    icon: 'Radio',
    estimatedHours: 40,
    tags: ['gRPC', 'Protobuf', 'Microservices', 'Networking'],
    prerequisites: ['Go, Java, or Node.js'],
    syllabusOverview: ['Protocol Buffers v3 Spec', 'Unary & Streaming RPCs', 'Interceptors & Deadlines', 'Service Mesh Integration']
  },

  // 4. Databases & Storage
  {
    id: 'postgresql-advanced-dba',
    title: 'PostgreSQL Deep Dive & Performance Tuning',
    category: 'Databases',
    level: 'Intermediate',
    description: 'Complex SQL queries, window functions, indexing strategies (B-Tree, GIN, GiST), EXPLAIN ANALYZE, and connection pooling.',
    icon: 'Database',
    estimatedHours: 50,
    featured: true,
    tags: ['PostgreSQL', 'SQL', 'Indexing', 'Performance'],
    prerequisites: ['Basic SQL knowledge'],
    syllabusOverview: ['Advanced SQL & Window Functions', 'Index Internals & Query Planning', 'Concurrency, MVCC & Locks', 'Replication & Partitioning']
  },
  {
    id: 'mongodb-nosql-architecture',
    title: 'MongoDB & NoSQL Data Modeling',
    category: 'Databases',
    level: 'Beginner',
    description: 'Document database design patterns, aggregation pipelines, sharding, replica sets, and transaction guarantees.',
    icon: 'FolderTree',
    estimatedHours: 45,
    tags: ['MongoDB', 'NoSQL', 'Aggregation', 'Atlas'],
    prerequisites: ['Basic database concepts'],
    syllabusOverview: ['Document Schema Design', 'Aggregation Framework Deep Dive', 'Indexing & Performance Audits', 'Replica Sets & Sharded Clusters']
  },
  {
    id: 'redis-caching-in-memory-systems',
    title: 'Redis & In-Memory Data Systems',
    category: 'Databases',
    level: 'Intermediate',
    description: 'Master Redis data structures, distributed locking with Redlock, pub/sub messaging, streams, caching strategies, and clustering.',
    icon: 'HardDrive',
    estimatedHours: 35,
    tags: ['Redis', 'Caching', 'PubSub', 'Streams'],
    prerequisites: ['Backend API experience'],
    syllabusOverview: ['Redis Data Primitives', 'Cache Invalidation & Thundering Herd', 'Distributed Locks & Rate Limiters', 'Redis Streams & Clustering']
  },
  {
    id: 'vector-databases-rag-systems',
    title: 'Vector Databases & Similarity Search',
    category: 'Databases',
    level: 'Intermediate',
    description: 'Embeddings, HNSW indexes, IVFFlat, vector indexing in Pinecone, Qdrant, Chroma, and pgvector for RAG applications.',
    icon: 'Binary',
    estimatedHours: 45,
    tags: ['Vector DB', 'Embeddings', 'AI', 'RAG'],
    prerequisites: ['Basic Python or JavaScript'],
    syllabusOverview: ['Vector Spaces & Distance Metrics', 'Approximate Nearest Neighbors (ANN)', 'pgvector & Pinecone Integration', 'Building Production RAG Pipelines']
  },
  {
    id: 'apache-kafka-event-streaming',
    title: 'Apache Kafka & Real-Time Event Streaming',
    category: 'Databases',
    level: 'Advanced',
    description: 'Topics, partitions, consumer groups, exactly-once semantics, Kafka Streams, and schema registry.',
    icon: 'Workflow',
    estimatedHours: 60,
    tags: ['Kafka', 'Event Streaming', 'Distributed Systems'],
    prerequisites: ['Distributed systems or backend experience'],
    syllabusOverview: ['Kafka Core Architecture & Partitions', 'Consumer Groups & Rebalancing', 'Kafka Streams & Transformations', 'Schema Registry & Disaster Recovery']
  },

  // 5. Cloud & DevOps
  {
    id: 'docker-containerization-mastery',
    title: 'Docker & Containerization Mastery',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    description: 'Build minimal secure container images, multi-stage builds, Docker Compose orchestration, volume management, and networking.',
    icon: 'Box',
    estimatedHours: 40,
    featured: true,
    tags: ['Docker', 'DevOps', 'Containers', 'Linux'],
    prerequisites: ['Command line basics'],
    syllabusOverview: ['Container Runtimes & Namespaces', 'Dockerfile Optimization & Multi-Stage', 'Docker Compose Microservices', 'Container Security & Vulnerability Audits']
  },
  {
    id: 'kubernetes-cloud-orchestration',
    title: 'Kubernetes (K8s) Production Engineering',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    description: 'Pods, deployments, services, ingress controllers, Helm charts, statefulsets, autoscaling (HPA/KEDA), and GitOps with ArgoCD.',
    icon: 'Boxes',
    estimatedHours: 70,
    tags: ['Kubernetes', 'K8s', 'Helm', 'GitOps'],
    prerequisites: ['Docker and Linux fundamentals'],
    syllabusOverview: ['Control Plane & Worker Architecture', 'Pod Scheduling & Service Networking', 'Helm & Kustomize Packaging', 'ArgoCD GitOps & Cluster Monitoring']
  },
  {
    id: 'aws-cloud-solutions-architect',
    title: 'AWS Cloud Solutions Architecture',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    description: 'Design resilient multi-tier AWS architectures with EC2, VPC, S3, RDS, Lambda serverless, IAM, CloudFront, and Route 53.',
    icon: 'Cloud',
    estimatedHours: 65,
    tags: ['AWS', 'Cloud', 'Serverless', 'Infrastructure'],
    prerequisites: ['Networking & web basics'],
    syllabusOverview: ['VPC & Subnet Network Topology', 'Compute (EC2, ECS, Lambda)', 'Storage & Databases (S3, RDS, DynamoDB)', 'High Availability & Cost Optimization']
  },
  {
    id: 'terraform-infrastructure-as-code',
    title: 'Terraform & Infrastructure as Code (IaC)',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    description: 'HCL configuration, state management, remote backends, reusable modules, workspaces, and multi-cloud provisioning.',
    icon: 'GitPullRequest',
    estimatedHours: 45,
    tags: ['Terraform', 'IaC', 'DevOps', 'Cloud'],
    prerequisites: ['Cloud basics (AWS, Azure or GCP)'],
    syllabusOverview: ['HCL Language & Providers', 'State Management & Locking', 'Modular Terraform Architectures', 'Terragrunt & CI/CD Pipelines']
  },
  {
    id: 'cicd-github-actions-automation',
    title: 'CI/CD Pipelines with GitHub Actions',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    description: 'Automate testing, linting, semantic versioning, container builds, security scans, and zero-downtime deployment workflows.',
    icon: 'GitBranch',
    estimatedHours: 35,
    tags: ['CI/CD', 'GitHub Actions', 'Automation', 'DevOps'],
    prerequisites: ['Git basics'],
    syllabusOverview: ['Workflow Syntax & Action Triggers', 'Matrix Builds & Caching', 'Secrets Management & OIDC', 'Automated Blue/Green Deployments']
  },
  {
    id: 'gcp-cloud-engineering',
    title: 'Google Cloud Platform (GCP) Architecture',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    description: 'Architect scalable solutions with Google Compute Engine, Cloud Run, GKE, BigQuery, Pub/Sub, and Cloud IAM.',
    icon: 'CloudRain',
    estimatedHours: 55,
    tags: ['GCP', 'Cloud Run', 'BigQuery', 'Serverless'],
    prerequisites: ['Basic cloud concepts'],
    syllabusOverview: ['GCP IAM & VPC Networking', 'Cloud Run & Containerized Serverless', 'BigQuery & Dataflow Pipelines', 'GKE Kubernetes on Google Cloud']
  },
  {
    id: 'linux-systems-administration-bash',
    title: 'Linux Systems Administration & Bash',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    description: 'POSIX permissions, process management, systemd services, SSH hardening, iptables, disk partitioning, and robust Bash scripting.',
    icon: 'TerminalSquare',
    estimatedHours: 40,
    tags: ['Linux', 'Bash', 'Sysadmin', 'Operating Systems'],
    prerequisites: ['None'],
    syllabusOverview: ['Linux Filesystem & File Permissions', 'Process Lifecycle & Systemd Services', 'Network Troubleshooting & SSH', 'Production Bash Scripting']
  },

  // 6. AI, Machine Learning & Data Science
  {
    id: 'generative-ai-llm-engineering',
    title: 'Generative AI & LLM Application Engineering',
    category: 'AI & Data Science',
    level: 'Intermediate',
    description: 'Prompt engineering, function calling, multimodal inputs, Retrieval Augmented Generation (RAG), vector search, and AI agents.',
    icon: 'Sparkles',
    estimatedHours: 60,
    featured: true,
    tags: ['GenAI', 'LLM', 'Gemini', 'RAG', 'Python'],
    prerequisites: ['Python or TypeScript basics'],
    syllabusOverview: ['Transformer Architecture & Tokens', 'Structured Outputs & Tool Calling', 'RAG Architecture & Chunking', 'Multi-Agent Autonomous Systems']
  },
  {
    id: 'machine-learning-with-python',
    title: 'Machine Learning from Scratch with Python',
    category: 'AI & Data Science',
    level: 'Intermediate',
    description: 'Linear regression, logistic regression, decision trees, random forests, SVMs, gradient boosting (XGBoost), and Scikit-Learn.',
    icon: 'BrainCircuit',
    estimatedHours: 65,
    tags: ['Machine Learning', 'Python', 'Scikit-Learn', 'Math'],
    prerequisites: ['Python and basic Linear Algebra'],
    syllabusOverview: ['Supervised Learning Algorithms', 'Unsupervised Clustering & PCA', 'Feature Engineering & Cross-Validation', 'Ensemble Methods & XGBoost']
  },
  {
    id: 'deep-learning-pytorch-architectures',
    title: 'Deep Learning & Neural Networks with PyTorch',
    category: 'AI & Data Science',
    level: 'Advanced',
    description: 'Backpropagation, tensors, convolutional networks (CNNs), transformers, autoencoders, and GPU model training.',
    icon: 'Network',
    estimatedHours: 70,
    tags: ['Deep Learning', 'PyTorch', 'Neural Networks', 'GPU'],
    prerequisites: ['Python and Machine Learning basics'],
    syllabusOverview: ['PyTorch Tensors & Autograd', 'Feedforward & Convolutional Nets', 'Attention Mechanisms & Transformers', 'Fine-Tuning & Model Quantization']
  },
  {
    id: 'data-science-analytics-pandas',
    title: 'Data Science & Analysis with Python',
    category: 'AI & Data Science',
    level: 'Beginner',
    description: 'Data wrangling with Pandas and NumPy, statistical analysis, exploratory data analysis (EDA), and data visualization with Seaborn.',
    icon: 'LineChart',
    estimatedHours: 45,
    tags: ['Data Science', 'Pandas', 'NumPy', 'Visualization'],
    prerequisites: ['Python fundamentals'],
    syllabusOverview: ['NumPy Numerical Arrays', 'Pandas DataFrame Transformations', 'Exploratory Data Analysis (EDA)', 'Statistical Inference & Hypothesis Testing']
  },
  {
    id: 'nlp-natural-language-processing',
    title: 'Natural Language Processing (NLP) & Transformers',
    category: 'AI & Data Science',
    level: 'Advanced',
    description: 'Tokenization, word embeddings (Word2Vec, GloVe), BERT, Hugging Face Transformers, fine-tuning, and semantic evaluation.',
    icon: 'MessageSquareText',
    estimatedHours: 60,
    tags: ['NLP', 'Transformers', 'HuggingFace', 'BERT'],
    prerequisites: ['Python & PyTorch basics'],
    syllabusOverview: ['Text Processing & Tokenizers', 'Self-Attention & Transformer Encoders', 'Hugging Face Pipelines & Fine-Tuning', 'Entity Recognition & Sentiment Models']
  },
  {
    id: 'computer-vision-opencv-yolo',
    title: 'Computer Vision with OpenCV & YOLO',
    category: 'AI & Data Science',
    level: 'Intermediate',
    description: 'Image filtering, edge detection, feature matching, object detection with YOLOv8, segmentation, and facial recognition.',
    icon: 'Eye',
    estimatedHours: 55,
    tags: ['Computer Vision', 'OpenCV', 'YOLO', 'Detection'],
    prerequisites: ['Python basics'],
    syllabusOverview: ['OpenCV Image Transformations', 'Contours & Feature Extraction', 'YOLOv8 Object Detection Training', 'Real-Time Video Stream Analytics']
  },

  // 7. Cybersecurity & Security
  {
    id: 'cybersecurity-fundamentals-defense',
    title: 'Cybersecurity Fundamentals & Defense',
    category: 'Cybersecurity',
    level: 'Beginner',
    description: 'Core security principles (CIA triad), cryptography, public key infrastructure, network defense, firewalls, and incident response.',
    icon: 'Shield',
    estimatedHours: 45,
    featured: true,
    tags: ['Cybersecurity', 'Network Defense', 'Cryptography'],
    prerequisites: ['Basic IT and networking knowledge'],
    syllabusOverview: ['Security Principles & Threat Models', 'Cryptography (AES, RSA, Hashing)', 'Network Protocols & Firewalls', 'Security Incident Handling']
  },
  {
    id: 'ethical-hacking-penetration-testing',
    title: 'Ethical Hacking & Penetration Testing',
    category: 'Cybersecurity',
    level: 'Intermediate',
    description: 'Reconnaissance, Nmap port scanning, vulnerability exploitation with Metasploit, privilege escalation, and report writing.',
    icon: 'Skull',
    estimatedHours: 65,
    tags: ['Pen Testing', 'Ethical Hacking', 'Nmap', 'Metasploit'],
    prerequisites: ['Linux & Networking basics'],
    syllabusOverview: ['Reconnaissance & Footprinting', 'Vulnerability Scanning & Nmap', 'Metasploit & Exploit Execution', 'Privilege Escalation & Post-Exploitation']
  },
  {
    id: 'web-application-security-owasp',
    title: 'Web Application Security & OWASP Top 10',
    category: 'Cybersecurity',
    level: 'Intermediate',
    description: 'Identify and remediate SQL Injection, XSS, CSRF, SSRF, Broken Access Control, insecure deserialization, and CORS flaws.',
    icon: 'Lock',
    estimatedHours: 50,
    tags: ['OWASP', 'AppSec', 'Web Security', 'Bug Bounty'],
    prerequisites: ['Web Development basics'],
    syllabusOverview: ['OWASP Top 10 Threat Analysis', 'Injection Attacks (SQLi, NoSQLi)', 'Cross-Site Scripting (XSS) & CSRF', 'Secure Headers, CSP & Authentication Hardening']
  },
  {
    id: 'cloud-security-iam-compliance',
    title: 'Cloud Security & DevSecOps',
    category: 'Cybersecurity',
    level: 'Advanced',
    description: 'Least privilege IAM policies, secret scanning, container image signing with Cosign, SAST/DAST tooling, and CIS benchmarks.',
    icon: 'FileCheck2',
    estimatedHours: 55,
    tags: ['DevSecOps', 'Cloud Security', 'IAM', 'SAST'],
    prerequisites: ['Cloud and CI/CD basics'],
    syllabusOverview: ['Zero Trust & Cloud IAM Policies', 'Shift-Left Security & SAST Tools', 'Container & Kubernetes Hardening', 'Audit Logging & SIEM Integration']
  },

  // 8. Architecture, System Design & Algorithms
  {
    id: 'system-design-large-scale-systems',
    title: 'System Design for Large-Scale Distributed Systems',
    category: 'System Design',
    level: 'Advanced',
    description: 'Design high-availability systems: Load balancers, caching tiers, CAP theorem, consistent hashing, database sharding, and rate limiting.',
    icon: 'Network',
    estimatedHours: 60,
    featured: true,
    tags: ['System Design', 'Scalability', 'Architecture', 'Interviews'],
    prerequisites: ['Backend development experience'],
    syllabusOverview: ['Horizontal Scaling & Load Balancing', 'Caching & Consistent Hashing', 'Database Sharding & Replication', 'Designing Uber, Netflix & Twitter']
  },
  {
    id: 'data-structures-algorithms-mastery',
    title: 'Data Structures & Algorithms (DSA) Interview Mastery',
    category: 'System Design',
    level: 'Intermediate',
    description: 'Arrays, linked lists, trees, graphs, heaps, dynamic programming, backtracking, two pointers, and sliding window patterns.',
    icon: 'Binary',
    estimatedHours: 70,
    tags: ['DSA', 'Algorithms', 'LeetCode', 'Interviews'],
    prerequisites: ['Basic programming in any language'],
    syllabusOverview: ['Big O Analysis & Linear Structures', 'Trees, BSTs, & Graphs (DFS/BFS)', 'Dynamic Programming & Memoization', 'Top Technical Interview Patterns']
  },
  {
    id: 'microservices-design-patterns',
    title: 'Microservices Design Patterns & Architecture',
    category: 'System Design',
    level: 'Advanced',
    description: 'Saga pattern, Event Sourcing, CQRS, API Gateways, Circuit Breakers, and distributed tracing with OpenTelemetry.',
    icon: 'Component',
    estimatedHours: 55,
    tags: ['Microservices', 'CQRS', 'Event Sourcing', 'Architecture'],
    prerequisites: ['Backend API experience'],
    syllabusOverview: ['Monolith to Microservices Deconstruction', 'Saga Pattern & Distributed Transactions', 'CQRS & Event Sourcing', 'Service Discovery & OpenTelemetry Tracing']
  },

  // 9. Mobile & Cross-Platform
  {
    id: 'flutter-cross-platform-apps',
    title: 'Flutter & Dart Cross-Platform Mastery',
    category: 'Mobile & App Dev',
    level: 'Intermediate',
    description: 'Build native iOS and Android apps with Flutter, widget trees, Riverpod state management, animations, and SQLite integration.',
    icon: 'Smartphone',
    estimatedHours: 55,
    tags: ['Flutter', 'Dart', 'Mobile', 'iOS', 'Android'],
    prerequisites: ['Basic programming knowledge'],
    syllabusOverview: ['Dart 3 Language Features', 'Widget Hierarchy & Custom Painters', 'Riverpod State Management', 'Native Platform Channels & Storage']
  },
  {
    id: 'react-native-expo-architecture',
    title: 'React Native & Expo Mobile Engineering',
    category: 'Mobile & App Dev',
    level: 'Intermediate',
    description: 'Build cross-platform mobile apps with React Native, Expo Router, NativeWind styling, device sensors, and offline sync.',
    icon: 'TabletSmartphone',
    estimatedHours: 50,
    tags: ['React Native', 'Expo', 'Mobile', 'TypeScript'],
    prerequisites: ['React basics'],
    syllabusOverview: ['React Native Components & Flexbox', 'Expo Router & Navigation', 'Hardware Sensors, Camera & Permissions', 'Offline-First SQLite & Sync']
  },

  // 10. Emerging & Specialized
  {
    id: 'blockchain-smart-contracts-solidity',
    title: 'Ethereum Smart Contracts & Solidity',
    category: 'Emerging Tech',
    level: 'Advanced',
    description: 'EVM mechanics, Solidity smart contract programming, ERC-20/721 tokens, Hardhat/Foundry testing, and security auditing.',
    icon: 'Coins',
    estimatedHours: 55,
    tags: ['Web3', 'Solidity', 'Blockchain', 'Ethereum'],
    prerequisites: ['JavaScript or Python basics'],
    syllabusOverview: ['Blockchain & EVM Internals', 'Solidity Smart Contract Syntax', 'Token Standards (ERC-20, ERC-721)', 'Reentrancy Attacks & Security Audits']
  },
  {
    id: 'big-data-apache-spark-hadoop',
    title: 'Big Data Engineering with Apache Spark',
    category: 'AI & Data Science',
    level: 'Advanced',
    description: 'PySpark, distributed RDDs, Spark SQL, streaming data pipelines, parquet optimization, and Delta Lake architecture.',
    icon: 'BarChart3',
    estimatedHours: 60,
    tags: ['Big Data', 'Spark', 'PySpark', 'Data Engineering'],
    prerequisites: ['Python and SQL'],
    syllabusOverview: ['Distributed Computing Principles', 'PySpark DataFrames & Transformations', 'Structured Streaming & Real-Time Ingestion', 'Delta Lake & Parquet Optimization']
  },
  {
    id: 'course-rust-systems-wasm',
    title: 'Rust Systems Programming & WebAssembly',
    category: 'Programming',
    level: 'Advanced',
    description: 'Master memory safety without garbage collection. Learn ownership, lifetimes, fearless concurrency, unsafe Rust, and compiling Rust to high-speed WebAssembly.',
    icon: 'Cpu',
    estimatedHours: 44,
    tags: ['Rust', 'WebAssembly', 'Wasm', 'Systems'],
    prerequisites: ['Any compiled language basics'],
    syllabusOverview: ['Ownership, Borrowing & Lifetimes', 'Structs, Traits & Generics', 'Threads, Channels & Concurrency', 'Wasm-pack and Browser Integration']
  },
  {
    id: 'course-vue3-nuxt',
    title: 'Vue 3 & Nuxt Full-Stack Web Development',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Build server-rendered, ultra-fast web apps using Vue 3 Composition API, Pinia state management, and Nuxt 3 server routes.',
    icon: 'Layout',
    estimatedHours: 36,
    tags: ['Vue.js', 'Nuxt', 'JavaScript', 'Frontend'],
    prerequisites: ['HTML, CSS, modern JavaScript'],
    syllabusOverview: ['Composition API & Script Setup', 'Pinia Store Architecture', 'Nuxt Server Engine & SSR', 'Deployment & Edge Rendering']
  },
  {
    id: 'course-kafka-event-driven',
    title: 'Apache Kafka & Distributed Event Streaming',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    description: 'Design distributed event-driven systems using Apache Kafka, partitions, consumer groups, schema registries, and stream processing.',
    icon: 'Layers',
    estimatedHours: 38,
    tags: ['Kafka', 'Event-Driven', 'Distributed Systems'],
    prerequisites: ['Backend API experience'],
    syllabusOverview: ['Kafka Architecture & Topic Partitioning', 'Producers, Consumers & Offset Management', 'Schema Registry & Avro Serializers', 'Kafka Streams & Fault Tolerance']
  },
  {
    id: 'course-elasticsearch-vector',
    title: 'Elasticsearch & Vector Search Engines',
    category: 'Databases',
    level: 'Intermediate',
    description: 'Implement full-text search, dense vector retrieval, hybrid search, BM25 ranking, and real-time analytical aggregations.',
    icon: 'Database',
    estimatedHours: 32,
    tags: ['Elasticsearch', 'Search', 'Vector DB', 'NoSQL'],
    prerequisites: ['JSON & REST APIs'],
    syllabusOverview: ['Inverted Index Mechanics & Sharding', 'Full-Text & Fuzzy Queries', 'Dense Vector Indexing for RAG', 'Aggregations & Kibana Visualizations']
  },
  {
    id: 'course-sre-observability',
    title: 'Site Reliability Engineering (SRE) & Observability',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    description: 'Master SLOs, SLIs, error budgets, distributed tracing with OpenTelemetry, Prometheus metrics collection, and Grafana dashboard alerts.',
    icon: 'Activity',
    estimatedHours: 34,
    tags: ['SRE', 'Prometheus', 'Grafana', 'OpenTelemetry'],
    prerequisites: ['Basic Linux & Cloud fundamentals'],
    syllabusOverview: ['SLO & Error Budget Frameworks', 'Prometheus Metrics Scraping & PromQL', 'Grafana Dashboard Architecture', 'OpenTelemetry Distributed Tracing']
  }
];

export const CATEGORIES = [
  'All Courses',
  'Web Development',
  'Programming',
  'Backend & APIs',
  'Databases',
  'Cloud & DevOps',
  'AI & Data Science',
  'Cybersecurity',
  'System Design',
  'Mobile & App Dev',
  'Emerging Tech'
];
