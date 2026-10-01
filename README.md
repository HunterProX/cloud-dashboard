# Cloud Dashboard

**Next.js + AWS + Kubernetes + Terraform**

## 🚀 Demo
[Live Demo](https://cloud-dashboard.vercel.app)

## 📸 Screenshots
![Dashboard](./screenshots/dashboard.png)

## 🛠 Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, Recharts
- **Backend:** Node.js, Express, PostgreSQL
- **Cloud:** AWS (EC2, EKS, RDS, CloudWatch)
- **Infra:** Kubernetes, Terraform, Helm
- **Monitoring:** Prometheus, Grafana
- **Deploy:** Vercel (frontend), AWS EKS (backend)

## ✨ Features

- Dashboard para monitoreo de infraestructura cloud
- Métricas en tiempo real (CPU, memoria, red, costos)
- Alertas automáticas
- Multi-cloud support (AWS, GCP)
- Infra como código con Terraform

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/HunterProX/cloud-dashboard.git

# Install dependencies
cd cloud-dashboard
npm install

# Set environment variables
cp .env.example .env
# Add your AWS credentials and database URL

# Run development server
npm run dev
```

## 🔧 Environment Variables

```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
DATABASE_URL=your_database_url
```

## 🏗 Infrastructure (Terraform)

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## 📄 License

MIT
