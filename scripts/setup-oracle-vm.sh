#!/usr/bin/env bash
# ==============================================================================
# Oracle Cloud Free Tier AMD Compute (1 OCPU / 1 GB RAM) Provisioning Script
# For: Ubuntu 22.04 / 24.04 LTS (Recommended) or Debian
# ==============================================================================

set -euo pipefail

APP_DIR="/var/www/mean_ecommerce_backend"
CURRENT_USER="${SUDO_USER:-$(whoami)}"

if [ "$EUID" -ne 0 ]; then
  echo "[-] Please run this script with sudo: sudo bash $0"
  exit 1
fi

echo "[+] Starting Oracle Cloud VM optimization and setup for $CURRENT_USER..."

# ------------------------------------------------------------------------------
# 1. Update OS Packages
# ------------------------------------------------------------------------------
echo "[+] Updating system packages..."
apt-get update -y
apt-get upgrade -y
apt-get install -y curl wget git rsync ufw software-properties-common ca-certificates gnupg

# ------------------------------------------------------------------------------
# 2. Configure 2 GB Swap Space (CRITICAL for 1 GB RAM VM)
# ------------------------------------------------------------------------------
if swapon --show | grep -q '/swapfile'; then
  echo "[*] Swap file already configured."
else
  echo "[+] Creating 2 GB swap space to prevent Out-Of-Memory (OOM) crashes..."
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab

  # Tune swappiness (10 means use RAM first, swap only when under pressure)
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
  echo "[+] Swap configured successfully."
fi

# ------------------------------------------------------------------------------
# 3. Install Node.js 22 LTS
# ------------------------------------------------------------------------------
if command -v node >/dev/null 2>&1 && node -v | grep -q 'v22'; then
  echo "[*] Node.js 22 is already installed ($(node -v))."
else
  echo "[+] Installing Node.js 22 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
  echo "[+] Node.js $(node -v) and npm $(npm -v) installed."
fi

# ------------------------------------------------------------------------------
# 4. Install PM2 & pm2-logrotate
# ------------------------------------------------------------------------------
echo "[+] Installing PM2 process manager..."
npm install -g pm2

# pm2-logrotate prevents log files from filling up your disk
sudo -u "$CURRENT_USER" pm2 install pm2-logrotate || true
sudo -u "$CURRENT_USER" pm2 set pm2-logrotate:max_size 10M
sudo -u "$CURRENT_USER" pm2 set pm2-logrotate:retain 5

# ------------------------------------------------------------------------------
# 5. Install & Configure Nginx
# ------------------------------------------------------------------------------
echo "[+] Installing Nginx web server..."
apt-get install -y nginx

systemctl enable nginx
systemctl start nginx

# ------------------------------------------------------------------------------
# 6. Configure Firewall (UFW & Oracle iptables)
# ------------------------------------------------------------------------------
echo "[+] Configuring firewall rules for OpenSSH, HTTP, and HTTPS..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# Oracle Cloud images sometimes have restrictive iptables rules by default:
if iptables -L INPUT -n --line-numbers | grep -q 'REJECT'; then
  echo "[+] Adjusting Oracle Cloud iptables to ensure ports 80/443 reach Nginx..."
  iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT || true
  iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT || true
  netfilter-persistent save 2>/dev/null || true
fi

# ------------------------------------------------------------------------------
# 7. Prepare Application Directory
# ------------------------------------------------------------------------------
echo "[+] Setting up application directory at $APP_DIR..."
mkdir -p "$APP_DIR/public/uploads"
mkdir -p "$APP_DIR/logs"
chown -R "$CURRENT_USER:$CURRENT_USER" "$APP_DIR"
chmod -R 775 "$APP_DIR"

# ------------------------------------------------------------------------------
# 8. Setup PM2 systemd auto-start for $CURRENT_USER
# ------------------------------------------------------------------------------
echo "[+] Registering PM2 systemd service to auto-start on VM reboot..."
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u "$CURRENT_USER" --hp "/home/$CURRENT_USER"

echo "=============================================================================="
echo "[✓] VM Setup Complete!"
echo "=============================================================================="
echo "Next steps:"
echo " 1. Copy your .env file into $APP_DIR/.env"
echo " 2. Copy nginx/mean-ecommerce.conf to /etc/nginx/sites-available/mean-ecommerce.conf"
echo "    sudo ln -s /etc/nginx/sites-available/mean-ecommerce.conf /etc/nginx/sites-enabled/"
echo "    sudo nginx -t && sudo systemctl reload nginx"
echo " 3. Verify Oracle Cloud VCN Security List has Ingress rules for port 80 & 443."
echo "=============================================================================="
