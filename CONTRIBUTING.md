# Guide de contribution

Ce guide explique comment contribuer au projet de pipeline CI/CD pour l'API de capteurs IoT.

## Prérequis

- Git
- Node.js v16 ou supérieur
- Vagrant et VirtualBox
- Ansible

## Installation de l'environnement de développement

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Kevinmrgt/DeploiementContinueEval.git
   cd DeploiementContinueEval
   ```

2. Lancez l'environnement Vagrant :
   ```bash
   cd infra
   vagrant up
   ```

3. Installez les dépendances de l'API :
   ```bash
   cd ../api
   npm install
   ```

## Processus de développement

1. **Avant de commencer** - Créez une branche dédiée à votre fonctionnalité :
   ```bash
   git checkout -b feature/nom-de-la-fonctionnalite
   ```

2. **Développement** - Codez votre modification

3. **Tests** - Assurez-vous que vos modifications passent tous les tests :
   ```bash
   npm test
   ```

4. **Déploiement local** - Testez votre modification en déployant localement :
   ```bash
   cd ..
   ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
   ```

5. **Commit** - Faites un commit avec un message descriptif :
   ```bash
   git commit -am "Description précise de la modification"
   ```

6. **Push** - Poussez votre branche sur GitHub :
   ```bash
   git push origin feature/nom-de-la-fonctionnalite
   ```

7. **Merge Request** - Ouvrez une merge request sur GitHub

## Création d'une release

1. Exécutez le script `release.sh` :
   ```bash
   ./release.sh
   ```

Ce script :
- Exécute les tests
- Crée un tag Git basé sur la date
- Met à jour la version avec standard-version
- Pousse les tags sur GitHub
- Déploie avec Ansible

## Conseils

- Vérifiez toujours l'état du déploiement avec `./check-status.sh`
- Documentez vos modifications dans le CHANGELOG.md
- Suivez les conventions de commit pour faciliter la génération automatique du changelog
