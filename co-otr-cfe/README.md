# CO otr — Calcul des compléments CFE (Togo)

Application mobile (Android) de calcul automatique des compléments à régler
après l'établissement de la carte CFE, packagée avec [Capacitor](https://capacitorjs.com).

## Ce qu'elle calcule

1. Choix du régime fiscal : **Entreprise individuelle** ou **Société**
2. Saisie du **loyer annuel** (FCFA)
3. Calcul automatique :
   - `RSL = (Loyer annuel × 8,75) / 100`
   - `DE  = (Loyer annuel × 2) / 100`
   - `TH  = 9 000 FCFA` (entreprise individuelle) ou `30 000 FCFA` (société)
   - `Total = RSL + DE + TH`

Cette application est fournie **à titre instructionnel**. Certaines pénalités
peuvent être appliquées selon les normes et règlements de l'OTR (Office
Togolais des Recettes).

## Structure du projet

- `www/index.html` — l'application (HTML/CSS/JS autonome, hors-ligne, aucune dépendance)
- `assets/` — sources de l'icône et du splash screen (fichiers HTML rendus en PNG)
- `android/` — projet Android natif généré par Capacitor

## Tester l'application dans un navigateur

Aucune installation n'est nécessaire, ouvrez simplement :

```
www/index.html
```

## Générer l'APK Android

Ce chantier (comme la version macOS de Devis Pro) nécessite un environnement
avec le SDK Android, absent de cet environnement de développement. La
génération de l'APK se fait donc automatiquement via **GitHub Actions** :
voir `.github/workflows/build-android.yml` à la racine du dépôt.

- À chaque envoi sur `main` touchant `co-otr-cfe/`, le workflow compile
  l'APK et le publie en téléchargement dans l'onglet **Actions** du dépôt
  (artifact `CO-otr-Android-apk`).
- Il peut aussi être lancé manuellement depuis l'onglet **Actions**
  (bouton "Run workflow").

Pour compiler localement (si vous disposez d'Android Studio / du SDK Android) :

```bash
npm install
npx cap sync android
cd android
./gradlew assembleDebug
```

L'APK généré (`app-debug.apk`) se trouve dans
`android/app/build/outputs/apk/debug/`. Il est installable directement sur un
téléphone Android (activer "Sources inconnues" dans les paramètres) — il ne
nécessite pas de compte développeur pour un usage de test/instructionnel.

## Régénérer l'icône / le splash screen

Les sources de l'icône (`CO` avec l'exposant `otr`) sont des pages HTML dans
`assets/` (`icon-full.html`, `icon-foreground.html`, `icon-background.html`,
`splash.html`), rendues en PNG puis transformées en icônes Android via
`@capacitor/assets` :

```bash
npx capacitor-assets generate --android
```
