#!/bin/bash
# Script pour vérifier et démarrer la VM Vagrant si nécessaire

set -e

echo "Vérification de l'état de la VM Vagrant..."
cd "$(dirname "$0")/infra"

# Vérifier si la VM est déjà en cours d'exécution
VM_STATUS=$(vagrant status --machine-readable | grep ",state," | cut -d',' -f4)

if [ "$VM_STATUS" != "running" ]; then
  echo "La VM n'est pas en cours d'exécution. Démarrage de la VM..."
  vagrant up
else
  echo "La VM est déjà en cours d'exécution."
fi

# Attendre que SSH soit disponible
echo "Attente de la disponibilité de SSH..."
for i in {1..30}; do
  if ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -p 2222 vagrant@127.0.0.1 "echo VM SSH OK" >/dev/null 2>&1; then
    echo "SSH est disponible sur la VM."
    exit 0
  fi
  echo "Tentative $i : SSH non disponible, nouvelle tentative dans 2 secondes..."
  sleep 2
done

echo "Impossible de se connecter à la VM via SSH après 30 tentatives."
exit 1
