# 📄 Rapport Technique - Pipeline CI/CD pour API IoT

## Introduction

Ce rapport détaille l'architecture, les choix techniques et le pipeline mis en place pour automatiser le déploiement de notre API Node.js de supervision de capteurs IoT.

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

Le pipeline complet de déploiement se décompose ainsi :

1. **Développement local** :
   - Développement de fonctionnalités
   - Tests locaux

2. **Publication de version** :
   - Exécution de `release.sh` qui :
     - Crée un tag Git basé sur la date
     - Met à jour la version avec standard-version
     - Pousse les tags sur GitHub

3. **CI/CD automatisé** :
   - Déclenchement du workflow GitHub Actions sur tag
   - Exécution des tests
   - Déploiement via Ansible

4. **Déploiement sur serveur** :
   - Ansible met à jour le code source
   - Installation/mise à jour des dépendances
   - Redémarrage de l'application avec PM2

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

## Améliorations futures

Plusieurs améliorations pourront être apportées :
- Intégration de monitoring avancé (Prometheus, Grafana)
- Mise en place d'un système de rollback automatique
- Utilisation de conteneurs Docker pour plus de portabilité
- Intégration de tests de charge et de performance
- Mise en place de blue/green deployments

## Conclusion

Ce pipeline CI/CD offre une solution complète pour automatiser le déploiement de notre API IoT. L'utilisation de technologies modernes et de bonnes pratiques DevOps garantit un processus de déploiement fiable et reproductible.