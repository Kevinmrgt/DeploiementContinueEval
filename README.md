# 🚀 Projet DevOps — Pipeline CI/CD

Ce projet met en place un pipeline de déploiement continu complet pour une API Node.js consommée par une application mobile IoT de supervision de capteurs environnementaux.

## 🔧 Technologies
- 🖥️ Infrastructure : Vagrant (Ubuntu VM locale)
- ⚙️ Configuration/Déploiement : Ansible
- 🛠️ CI/CD : GitHub Actions
- 🌐 Backend : Node.js (API REST)
- 📦 Gestion de processus : PM2

## 📁 Structure du projet
- `infra/` : Configuration Terraform pour Vagrant
- `ansible/` : Configuration Ansible pour le déploiement
- `api/` : Code source de l'API Node.js
- `release.sh` : Script de release
- `.github/workflows/` : Pipeline GitHub Actions
- `rapport.md` : Description technique du projet

## 🚀 Démarrage rapide
1. Lancer la VM Vagrant : `cd infra && vagrant up`
2. Déployer l'API : `./release.sh`
3. Accéder à l'API : http://localhost:3000

Pour plus de détails, consultez le fichier `rapport.md`.
