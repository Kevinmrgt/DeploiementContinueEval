# 📄 Rapport Technique - Pipeline CI/CD pour API IoT

**Dépôt GitHub** : [https://github.com/Kevinmrgt/DeploiementContinueEval](https://github.com/Kevinmrgt/DeploiementContinueEval)

## Introduction

Ce rapport détaille l'architecture, les choix techniques et le pipeline mis en place pour automatiser le déploiement de notre API Node.js de supervision de capteurs IoT.

## Domaine fonctionnel : API de supervision de capteurs

Notre solution est une API REST développée en Node.js qui permet de superviser des capteurs environnementaux IoT. Elle offre les fonctionnalités suivantes :

- **Gestion des capteurs** : CRUD complet (Création, Lecture, Mise à jour, Suppression)
- **Types de capteurs supportés** : Température, Humidité, CO2, et autres capteurs environnementaux
- **Format de données standardisé** : Données structurées en JSON avec métadonnées (unités, localisation, horodatage)
- **Endpoints de santé** : Surveillance de l'état de l'API via `/health`
- **Documentation intégrée** : Informations sur les endpoints disponibles à la racine de l'API

Cette API est conçue pour être consommée par des applications mobiles de surveillance environnementale, permettant aux utilisateurs de visualiser en temps réel les données de leurs capteurs IoT.

## Architecture globale

L'architecture du projet repose sur les composants suivants :

1. **Environnement local** : VM Ubuntu via Vagrant
2. **Configuration automatisée** : Ansible
3. **CI/CD** : GitHub Actions
4. **Runtime** : Node.js géré par PM2

Le schéma ci-dessous résume le flux de déploiement :

```
GitHub (Code Source) → GitHub Actions (CI/CD) → Ansible (Configuration) → VM Vagrant (Production)
```

## Choix techniques

### Choix d'infra et provider

#### Infrastructure locale (Vagrant/VirtualBox)

Pour notre infrastructure de déploiement, nous avons opté pour une solution basée sur Vagrant avec VirtualBox comme provider. Ce choix présente plusieurs avantages :

- **Environnement reproductible** : Définition de l'infrastructure sous forme de code (IaC)
- **Isolation** : VM complètement isolée du système hôte
- **Portabilité** : Fonctionne sur tous les systèmes d'exploitation (Windows, macOS, Linux)
- **Faible coût** : Solution gratuite, idéale pour le développement et les tests
- **Proximité avec la production** : Utilisation de la même distribution Linux (Ubuntu 20.04 LTS) que sur les serveurs de production

#### Alternative cloud considérée

Nous avons également évalué des solutions cloud comme AWS (EC2) ou Azure (VM), mais pour ce projet, la solution locale répondait mieux à nos besoins en termes de :
- Coût (gratuit vs facturation à l'usage)
- Simplicité de mise en œuvre
- Contrôle total sur l'environnement
- Possibilité de travailler hors-ligne

#### Terraform pour la gestion Vagrant

Nous utilisons Terraform avec le provider Vagrant pour gérer notre VM de manière déclarative et reproductible. Ce choix permet :
- Une approche Infrastructure as Code cohérente
- La possibilité d'ajouter facilement d'autres VMs ou providers à l'avenir
- Une gestion uniforme des ressources locales et cloud si besoin

### Infrastructure (Vagrant)

Nous utilisons Vagrant avec VirtualBox pour créer une VM Ubuntu locale. Ce choix permet :
- Un environnement isolé et reproductible
- Une configuration proche de la production
- La possibilité de tester localement le déploiement

La configuration expose le port 3000 pour l'API et utilise une configuration standard Ubuntu 20.04 LTS pour sa stabilité.

### Configuration (Ansible)

Ansible a été choisi pour automatiser la configuration du serveur et le déploiement de l'API pour les raisons suivantes :
- Approche déclarative et idempotente
- Sans agent (utilise SSH)
- Playbooks simples en YAML
- Large communauté et documentation

Notre playbook `deploy.yml` :
1. Installe les prérequis (Git, Node.js)
2. Configure PM2 pour la gestion des processus
3. Clone/met à jour le code source
4. Installe les dépendances
5. Démarre ou redémarre l'application

### CI/CD (GitHub Actions)

Le workflow GitHub Actions est déclenché lors d'un push de tag et automatise :
1. Le checkout du code
2. L'installation des dépendances
3. L'exécution des tests
4. Le déploiement via Ansible

### API (Node.js)

L'API REST utilise Express.js et propose :
- Des endpoints RESTful pour la gestion des capteurs
- Un format JSON standardisé
- Une gestion des erreurs cohérente
- Des logs structurés avec Winston

### Gestion de processus (PM2)

PM2 assure :
- Le démarrage automatique de l'application
- Le redémarrage en cas de crash
- La rotation des logs
- Le clustering pour une meilleure utilisation des ressources

## Pipeline de déploiement

### Structure des dossiers du projet

Notre projet est organisé selon une structure claire qui sépare les différentes préoccupations :

#### Dossier `infra/`

Ce dossier contient toute la configuration relative à l'infrastructure :

```
infra/
├── main.tf              # Configuration Terraform principale
├── variables.tf         # Variables Terraform
└── Vagrantfile          # Configuration Vagrant pour la VM
```

- **main.tf** : Définit les ressources Terraform, notamment la VM Vagrant et ses configurations
- **variables.tf** : Contient les variables utilisées par Terraform
- **Vagrantfile** : Configuration détaillée de la VM (OS, ressources, ports, etc.)

#### Dossier `ansible/`

Ce dossier contient les playbooks et inventaires Ansible pour la configuration et le déploiement :

```
ansible/
├── deploy.yml           # Playbook principal de déploiement
└── inventory.ini        # Fichier d'inventaire des serveurs cibles
```

- **deploy.yml** : Playbook qui installe les dépendances (Node.js, PM2), copie les fichiers de l'API et configure les services
- **inventory.ini** : Définit les serveurs cibles (dans notre cas, la VM Vagrant locale)

#### Dossier `api/`

Ce dossier contient le code source de l'API Node.js :

```
api/
├── index.js             # Point d'entrée de l'application
├── package.json         # Dépendances et scripts npm
├── CHANGELOG.md         # Journal des modifications
├── __tests__/           # Tests automatisés
│   └── api.test.js      # Tests des endpoints API
├── routes/              # Définition des routes de l'API
│   └── sensorRoutes.js  # Routes pour la gestion des capteurs
└── utils/               # Utilitaires
    └── logger.js        # Configuration des logs
```

- **index.js** : Configuration de l'application Express.js, middlewares et routes
- **package.json** : Définition des dépendances et des scripts (test, build, start)
- **routes/** : Organisation des endpoints par domaine fonctionnel
- **__tests__/** : Tests automatisés avec Jest

### Fonctionnement du pipeline CI/CD

Le pipeline complet de déploiement se décompose ainsi :

1. **Développement local** :
   - Développement de fonctionnalités
   - Tests locaux

2. **Publication de version** :
   - Exécution de `release.sh` qui :
     - Crée un tag Git basé sur la date et l'heure
     - Met à jour la version avec standard-version
     - Pousse les tags sur GitHub

3. **CI/CD automatisé** :
   - Déclenchement du workflow GitHub Actions sur tag
   - Exécution des tests
   - Création d'un package de déploiement

4. **Déploiement manuel** :
   - Téléchargement du package de déploiement depuis GitHub Actions
   - Déploiement local via Ansible
   - Vérification du déploiement avec `check-status.sh`

Cette approche semi-automatisée résout les problèmes d'accessibilité entre GitHub Actions et notre VM Vagrant locale, tout en maintenant un processus de déploiement fiable et reproductible.

## Tests (Jest)

L'API est testée avec Jest et supertest, ce qui nous permet de :
- Tester tous les endpoints de l'API de manière automatisée
- Valider les réponses HTTP (status code, contenu)
- Vérifier la cohérence des données
- S'assurer de la stabilité lors des nouvelles versions

Architecture des tests :
- Tests unitaires : fonctions et utilitaires
- Tests d'intégration : endpoints API complets
- Mocks pour les dépendances externes (si nécessaire)

Les tests sont intégrés au pipeline CI/CD et exécutés avant chaque déploiement, garantissant que seul le code fonctionnel soit déployé en production.

## Avantages de cette architecture

- **Reproductibilité** : Infrastructure as Code avec Vagrant et Terraform
- **Automatisation** : Déploiement sans intervention manuelle
- **Fiabilité** : Tests systématiques avant déploiement
- **Scalabilité** : Architecture adaptable à un environnement multi-serveurs
- **Maintenance** : Gestion de processus avec PM2 pour garantir la disponibilité

## Obstacles rencontrés et solutions

Au cours du développement et de la mise en place de ce pipeline CI/CD, nous avons rencontré plusieurs défis techniques qui ont nécessité des solutions spécifiques :

### 1. Connectivité SSH depuis GitHub Actions vers VM locale

**Problème** : Échec de connexion SSH lors de l'exécution du workflow GitHub Actions avec l'erreur "Connection refused".

**Log d'erreur** :
```
TASK [Gathering Facts] *********************************************************
fatal: [127.0.0.1]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh: ssh: connect to host 127.0.0.1 port 2222: Connection refused", "unreachable": true}
```

**Solution** : 
- Reconnaissance du fait que GitHub Actions s'exécute sur les serveurs distants de GitHub et ne peut pas accéder directement à notre VM locale
- Modification du workflow pour qu'il crée un package de déploiement au lieu d'essayer de déployer directement
- Mise en place d'un processus de déploiement semi-automatisé où :
  1. GitHub Actions exécute les tests et crée un package de déploiement
  2. Le développeur télécharge manuellement le package et l'utilise pour déployer localement

```yaml
- name: Create deployment package
  run: |
    VERSION=${GITHUB_REF#refs/tags/v}
    echo "Création du package de déploiement pour la version $VERSION"
    mkdir -p deployment
    cp -r api deployment/
    cp -r ansible deployment/
    tar -czf api-deployment-$VERSION.tar.gz deployment
```

### 2. Problème de SSH avec GitHub Actions

**Problème** : Échec d'authentification SSH lors du déploiement via GitHub Actions vers notre VM Vagrant.

**Log d'erreur** :
```
TASK [Deploy Node.js API] ******************************************
fatal: [127.0.0.1]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh: Permission denied (publickey).", "unreachable": true}
```

**Solution** : 
- Génération d'une nouvelle paire de clés SSH dédiée au déploiement
- Stockage sécurisé de la clé privée dans les secrets GitHub
- Configuration explicite de l'agent SSH dans le workflow GitHub Actions :

```yaml
- name: Set up SSH key
  uses: webfactory/ssh-agent@v0.7.0
  with:
    ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
```

### 3. Permissions insuffisantes pour PM2

**Problème** : PM2 ne pouvait pas redémarrer l'application après déploiement (problème de permissions).

**Log d'erreur** :
```
[PM2] Error: EACCES: permission denied, open '/home/vagrant/.pm2/pm2.log'
```

**Solution** :
- Modification du playbook Ansible pour exécuter les commandes PM2 avec l'utilisateur approprié :

```yaml
- name: Start application with PM2
  shell: cd {{ app_dir }} && pm2 start index.js --name api-server
  become_user: vagrant
```

### 4. Conflits de tags Git

**Problème** : Échecs lors de la création de tags basés sur la date dans le script de release.

**Log d'erreur** :
```
error: tag 'v2025.05.19' already exists
```

**Solution** :
- Modification du script `release.sh` pour générer des tags uniques en incluant l'heure précise :

```bash
VERSION=$(date +'%Y.%m.%d-%H%M%S')
echo "🏷️  Creating tag v$VERSION..."
git tag "v$VERSION"
```

### 5. Gestion des dépendances Node.js

**Problème** : Installations incomplètes des dépendances Node.js sur le serveur de déploiement.

**Log d'erreur** :
```
Error: Cannot find module 'express'
```

**Solution** :
- Mise à jour du playbook Ansible pour garantir l'installation complète des dépendances :
- Ajout de vérifications explicites de l'installation des packages
- Configuration du mode production pour npm

```yaml
- name: Install Node.js dependencies
  npm:
    path: "{{ app_dir }}"
    state: present
    production: yes
```

### 6. Problèmes avec les actions GitHub externes

**Problème** : Erreurs lors de l'utilisation d'actions GitHub externes dans notre workflow.

**Log d'erreur** :
```
Error: Missing download info for actions/upload-artifact@v3
```

**Solution** :
- Simplification du workflow pour utiliser un minimum d'actions externes
- Remplacement des actions problématiques par des commandes shell simples
- Création d'un processus de déploiement semi-automatisé avec des instructions claires

Ces obstacles et leurs solutions illustrent les défis typiques rencontrés lors de la mise en place d'un pipeline CI/CD robuste, et montrent comment une approche méthodique de résolution de problèmes peut les surmonter.

## Améliorations futures

Plusieurs améliorations pourront être apportées :
- Intégration de monitoring avancé (Prometheus, Grafana)
- Mise en place d'un système de rollback automatique
- Utilisation de conteneurs Docker pour plus de portabilité
- Intégration de tests de charge et de performance
- Mise en place de blue/green deployments

## Conclusion

Ce pipeline CI/CD offre une solution complète pour automatiser le déploiement de notre API IoT. L'utilisation de technologies modernes et de bonnes pratiques DevOps garantit un processus de déploiement fiable et reproductible.