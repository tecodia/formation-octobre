# Formation GraphQL avec Apollo 🚀

Formation pratique de 2 jours sur GraphQL avec Apollo Server et Apollo Client.

## 📚 Contenu du Repository

### `/slides-formation.md`
Présentation Marp de 40 slides couvrant :
- Jour 1 : Fondamentaux GraphQL, Apollo Server, DataLoader, Pagination
- Jour 2 : Apollo Client, Cache, Subscriptions, Architecture distribuée

Pour générer les slides :
```bash
npm install -g @marp-team/marp-cli
marp slides-formation.md -o slides.html
# ou
marp slides-formation.md --server  # Pour prévisualiser
```

### `/src` - Code du projet
Projet GraphQL progressif organisé en branches Git :

## 🎯 Structure des Branches

| Branche | Description | Concepts |
|---------|-------------|----------|
| **main** | Step 0 - Serveur basique | Apollo Server minimal, monofichier |
| **step1** | Organisation modulaire | TypeDefs/Resolvers séparés |
| **step2** | Relations entre types | Field resolvers, graphe de données |
| **step3** | PostgreSQL (à implémenter) | Docker, Prisma/TypeORM |

### Branches à venir (voir ROADMAP.md)
- step4 : DataLoader
- step5 : Cache HTTP
- step6 : Plugin Monitoring
- step7 : Pagination Cursor
- step8 : Frontend React
- step9 : Queries & Mutations
- step10 : Persisted Queries
- step11 : Subscriptions
- step12 : Optimistic UI
- step13 : Authentication JWT
- step14 : Error Handling
- step15 : Federation (bonus)

## 🚀 Démarrage Rapide

```bash
# Cloner le repo
git clone git@github.com:tecodia/formation-octobre.git
cd formation-octobre

# Installer les dépendances
npm install

# Lancer le serveur
npm run dev

# Accéder à Apollo Studio
# http://localhost:4000
```

## 📝 Navigation entre les Steps

```bash
# Voir toutes les branches
git branch -a

# Passer au step 1
git checkout step1

# Voir les changements
git diff main..step1

# Passer au step 2
git checkout step2
```

## 👨‍🎓 Pour les Étudiants

1. **Commencez par `main`** : Le code le plus simple
2. **Suivez les steps** : Chaque branche ajoute des concepts
3. **Si vous êtes bloqués** : Checkout la branche suivante
4. **Testez dans Apollo Studio** : http://localhost:4000

## 👨‍🏫 Pour les Formateurs

- **Durée suggérée** : 30-45 min par step
- **Jour 1** : Steps 0-7 (Backend)
- **Jour 2** : Steps 8-15 (Frontend + Avancé)
- **Flexibilité** : Les étudiants avancés peuvent skip des steps

## 📖 Documentation

- [Slides de formation](./slides-formation.md)
- [Roadmap complète](./ROADMAP.md)
- [README Step 1](./README_STEP1.md)
- [README Step 2](./README_STEP2.md)

## 🛠️ Technologies Utilisées

- **GraphQL** : Langage de requête
- **Apollo Server** : Serveur GraphQL
- **TypeScript** : Type safety
- **tsx** : Hot reload en développement
- **Docker** : PostgreSQL (step3+)
- **React** : Frontend (step8+)
- **Apollo Client** : Client GraphQL (step8+)

## 📚 Ressources Complémentaires

- [Documentation Apollo](https://www.apollographql.com/docs/)
- [Spécification GraphQL](https://graphql.org/)
- [GraphQL Code Generator](https://graphql-code-generator.com/)

## 👨‍💻 Auteur

**Jonathan Jalouzot**
- GitHub : [@captainjojo](https://github.com/captainjojo)

## 📄 Licence

MIT