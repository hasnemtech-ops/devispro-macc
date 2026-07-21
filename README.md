# Devis Pro — version Bureau (Windows / macOS)

Application de devis autonome (hors-ligne), packagée avec Electron.

## Prérequis

- [Node.js](https://nodejs.org) (version 18 ou plus récente) installé sur votre ordinateur
- Une connexion internet **au moment du build uniquement** (pour télécharger Electron une seule fois — l'application finale, elle, fonctionne 100% hors-ligne)

## Installation des dépendances

Ouvrez un terminal dans ce dossier puis lancez :

```
npm install
```

## Tester l'application (sans créer d'installeur)

```
npm start
```

## Créer les installeurs

### Windows (64 bits et 32 bits)
À lancer **depuis un ordinateur Windows** (ou Linux/Mac avec Wine installé) :

```
npm run dist:win
```

Les installeurs `.exe` (NSIS) seront générés dans `dist/` :
- `Devis Pro Setup x.x.x.exe` (64 bits)
- `Devis Pro Setup x.x.x.exe` (32 bits, dans le même dossier avec un nom distinct)

### macOS
À lancer **depuis un Mac** (Apple ne permet pas de créer un `.dmg` signé depuis un autre système) :

```
npm run dist:mac
```

Le fichier `.dmg` sera généré dans `dist/`, compatible Mac Intel (x64) et Apple Silicon (arm64).

⚠️ Sur macOS, sans certificat de développeur Apple, l'utilisateur final devra faire un clic droit → "Ouvrir" la première fois (Gatekeeper), car l'app ne sera pas notarisée. C'est normal pour une distribution en dehors du Mac App Store sans compte développeur Apple (99$/an).

## Important — 32 bits sur Windows

Electron a officiellement abandonné le support Windows 32 bits à partir de la version 23. Ce projet utilise volontairement **Electron 22.3.27** (dernière version compatible 32 bits) pour permettre `npm run dist:win` de produire les deux architectures. Limite à connaître : cette version d'Electron est plus ancienne et ne recevra plus de mises à jour de sécurité Chromium. Si le 32 bits n'est pas réellement nécessaire pour vos clients (Windows 32 bits est aujourd'hui très rare), il est recommandé de passer à une version récente d'Electron et de ne cibler que le 64 bits — dites-le si vous préférez cette option.

## Licence par clé d'activation

Le système de licence (code appareil + clé d'activation à saisir, valable 365 jours glissants) est identique à la version Android : chaque installation (Windows ou Mac) génère son propre code appareil, et nécessite sa propre clé — générée avec `generateur-cles.html`, à l'aide du même secret `LICENSE_SECRET` que celui codé dans `app/electricien-devis.html`.
