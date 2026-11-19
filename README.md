| <img src="docs/theme/logo.svg" width="128"> |
| - |

# Website: `oratoriotavernola.it`

## Overview

Questo progetto rappresenta il sito ufficiale del ***Oratorio di Tavernola***. Il sito mostra informazioni relative alle attività dell'oratorio, agli eventi in programma e alle iniziative della comunità.

## Prerequisiti

> [!IMPORTANT]
>
> - Node.js

## Istruzioni

Utilizzo:

```sh
bash cmd.sh {start|setup|deploy}
```

### `setup`

Se non è stato ancora configurato il progetto, è possibile farlo eseguendo:

```sh
bash cmd.sh setup
```

Una volta completato il processo di configurazione, il progetto sarà accessibile all'indirizzo `localhost:4321`.

```sh
bash cmd.sh start
```

### `deploy`

Per distribuire l'applicazione in produzione, utilizzare il seguente comando:

```sh
bash cmd.sh deploy
```

Questo progetto utilizza GitHub Actions per CI/CD. Il workflow per il deployment è configurato nel file `.github/workflows/deploy.yml` per compilare automaticamente il progetto e distribuirlo nell'ambiente GitHub Pages.

## License

Il progetto è distribuito sotto la [GNU General Public License version 3](https://opensource.org/license/gpl-3-0). È possibile trovare il testo completo della licenza nel repository del progetto.
