# 🚀 Projet DevOps — Pipeline CI/CD

Ce projet met en place un pipeline de déploiement continu complet pour une API Node.js consommée par une application mobile IoT de supervision de capteurs environnementaux.

## 🆕 Dernière mise à jour (Mai 2025)
- ✅ Correction du workflow de déploiement automatique
- 🔄 Amélioration de la stabilité du déploiement continu
- 🔒 Renforcement de la sécurité des clés SSH
- 📝 Documentation mise à jour
- 🔧 Optimisation des performances de l'API
- 🌍 Support amélioré pour les différents fuseaux horaires

## 🔧 Technologies
- 🖥️ Infrastructure : Vagrant (Ubuntu VM locale)
- ⚙️ Configuration/Déploiement : Ansible
- 🛠️ CI/CD : GitHub Actions
- 🌐 Backend : Node.js (API REST)
- 📦 Gestion de processus : PM2
- 🧪 Tests : Jest

## 📁 Structure du projet
- `infra/` : Configuration Terraform pour Vagrant
- `ansible/` : Configuration Ansible pour le déploiement
- `api/` : Code source de l'API Node.js
- `release.sh` : Script de release
- `.github/workflows/` : Pipeline GitHub Actions
- `rapport.md` : Description technique du projet

## 🚀 Démarrage rapide
1. Cloner le dépôt : `git clone https://github.com/Kevinmrgt/DeploiementContinueEval.git`
2. Lancer la VM Vagrant : `cd infra && vagrant up`
3. Déployer l'API manuellement : `cd .. && ansible-playbook -i ansible/inventory.ini ansible/deploy.yml`
4. Accéder à l'API : http://localhost:3000
5. Pour une release automatisée : `./release.sh`
6. Pour vérifier l'état du déploiement : `./check-status.sh`

## 📊 Pipeline CI/CD
Le déploiement automatisé est déclenché à chaque push sur la branche main ou par le push d'un tag :
```bash
# Déploiement automatique à chaque push sur main
git push origin main

# Ou pour une release versionnée :
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```
GitHub Actions exécutera alors :
1. Installation des dépendances
2. Exécution des tests
3. Déploiement via Ansible

## 🧪 Tests

Les tests unitaires utilisent Jest et supertest pour valider le bon fonctionnement de l'API:

```bash
cd api
npm test
```

Ces tests vérifient notamment :
- Les endpoints principaux (/health, /)
- Les opérations CRUD sur les capteurs
- La gestion des erreurs
- La validation des données

## 🔍 Surveillance

L'application utilise PM2 pour la gestion des processus et la surveillance en temps réel :

```bash
# Vérifier l'état de l'application
pm2 status

# Consulter les logs
pm2 logs
```
