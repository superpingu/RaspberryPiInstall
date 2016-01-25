# Raspberry Pi : configuration pour la robotique

## Installation de Raspbian RT

Installer l'image de Raspbian RT sur une carte microSD ([voir emlid](http://docs.emlid.com/navio/Downloads/Real-time-Linux-RPi2/))

**Pour OS X** : utiliser le script *PI Filler*

## Logiciels à Installer

d'abord, mettre à jour la liste des dépôts et le système :

```bash
sudo apt-get update
sudo apt-get upgrade
```

Pour installer NodeJS (remplacer "4.2.3" par la version stable la plus récente):

```bash
wget https://nodejs.org/dist/v4.2.3/node-v4.2.3-linux-armv7l.tar.gz
tar -xvf node-v4.2.3-linux-armv7l.tar.gz
cd node-v4.2.3-linux-armv7l
sudo cp -R * /usr/local/
```

puis

```bash
sudo apt-get install -y lighttpd g++-4.7
```

assurer le support de C++11 : choisir la version 4.7 à la dernière étape

```bash
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.7 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.7
sudo update-alternatives --config gcc
```
et installer l'outil de build pour node et forever:

```bash
sudo npm install -g node-gyp
sudo npm install -g forever
```

WiringPi :

```bash
git clone git://git.drogon.net/wiringPi
cd wiringPi
./build
```
Robot drivers (avant faire le point *clés ssh* de la Configuration):

```bash
git clone git@bitbucket.org:telecomparitoc/robotdriver.git
cd robotdriver
make
sudo make install
```

## Configuration du système

à partir de maintenant, aller dans répertoire *raspi_install*

### Baudrate de l'I2C
éditer le fichier `/etc/modprobe.d/i2c.conf`:
modifiant la ligne `options i2c_bcm2708 baudrate=1000000`
pour `options i2c_bcm2708 baudrate=100000`

### configuration des services

* clés ssh

```bash
mkdir -p ~/.ssh
cp ssh/* ~/.ssh
ssh-add ~/.ssh/id_rsa
```

* services webs (basés sur node)

```bash
sudo cp -r apps/ /var/
sudo cp -r www/* /var/www/
sudo chown pi /var/www
sudo ln -s /var/apps/motortest/public/ /var/www/
sudo mv /var/www/public /var/www/mdt
cd /var/apps/raspiserial/
sudo chown pi .
npm install
cd /var/apps/motortest/
sudo chown pi .
npm install
```

puis éditer `/var/apps/rpc/config.json` and choisir un nom parlant pour retrouver le
Pi facilement sur le portail web

pour charger les services au démarrage :

```bash
sudo cp PIconnector PIserial /etc/init.d/
sudo chmod 755 /etc/init.d/PIconnector
sudo chmod 755 /etc/init.d/PIserial
sudo update-rc.d PIconnector defaults
sudo update-rc.d PIserial defaults
sudo ln /usr/local/bin/node /bin/node
```

* serveur HTTP

`sudo cp ./lighttpd.conf /etc/lighttpd/lighttpd.conf`

et recharger la configuration avec `sudo service lighttpd restart`

* Wifi
ajouter le réseau wifi dans `/etc/wpa_supplicant/wpa_supplicant.conf` sous la forme

```
network={
    ssid="testing"
    psk="password"
}
```
