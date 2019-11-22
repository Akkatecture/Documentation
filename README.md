<a href="https://akkatecture.net/"><img src="https://raw.githubusercontent.com/Lutando/Akkatecture/master/logo.svg?sanitize=true" width="100%" height="200"></a>


| master | dev |
|:-------:|:------:|
| [![Build Status](https://dev.azure.com/lutando/Akkatecture/_apis/build/status/Akkatecture%20Documentation%20Release%20CI%20CD?branchName=master)](https://dev.azure.com/lutando/Akkatecture/_build/latest?definitionId=17&branchName=master) | [![Build Status](https://dev.azure.com/lutando/Akkatecture/_apis/build/status/Akkatecture%20Documentation%20CI%20CD?branchName=dev)](https://dev.azure.com/lutando/Akkatecture/_build/latest?definitionId=21&branchName=dev) |

# Akkatecture Documentation
To serve the documentation locally do the following:
```
npm install 
```
or
```
yarn install
```

and then
```
gatsby develop
````

this will run a hot-reloadable version of the documentation website. It is best to run this using Node v8, so if youre using nvm do a 

```
nvm use 8.*
```

node 8.16.0

## Contributor Notes
The markdown files  in `/content/docs` folder contains all the documentation for the akkatecture documentation pages.

alternatively you can directly edit the markdown in github and submit a pull request if you see any spelling or grammatical errors.

## Deployment

Using Node v8 is the safest choice

Make sure that you have two remotes set up for your deployment look like this.

```
origin    git@github.com:Akkatecture/Akkatecture.github.io.git (fetch)
origin    git@github.com:Akkatecture/Akkatecture.github.io.git (push)
source    git@github.com:Akkatecture/Documentation.git (fetch)
source    git@github.com:Akkatecture/Documentation.git (push)
```

Take note that all source changes happen on the source remote and all of the bundled builds go onto the github.io repository. The deployment script (`npm run deploy`) will push the static content into the Akkatecture.github.io.