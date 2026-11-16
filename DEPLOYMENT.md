# Deployment Guide: Oracle Cloud Free Tier (AMD Compute) with Nginx & PM2

This guide walks you through deploying the **MEAN Ecommerce Backend** to an **Oracle Cloud Infrastructure (OCI) Always Free AMD Compute instance** (`VM.Standard.E2.1.Micro`: 1 OCPU, 1 GB RAM) using **PM2**, **Nginx**, and **GitHub Actions CI/CD**.

---

## 1. Architecture Overview

* **GitHub Actions Runner (CI/CD)**: Runs tests and compiles TypeScript (`tsc` -> `dist/`). This prevents CPU and RAM starvation on your 1 GB instance.
* **Oracle Cloud VM**:
  * **2 GB Swapfile**: Prevents Linux Out-Of-Memory (OOM) killer crashes.
  * **Nginx**: Listens on ports 80/443, directly serves `/public/uploads/` images from disk to save Node.js RAM/CPU, and reverse-proxies `/` API traffic to `http://127.0.0.1:3000`.
  * **PM2**: Runs `dist/server.js` in `fork` mode, restarts if RAM exceeds 300 MB, and auto-starts on system reboot.

---

## 2. Oracle Cloud VM Provisioning

1. Log in to the [Oracle Cloud Console](https://cloud.oracle.com).
2. Navigate to **Compute** > **Instances** > **Create Instance**.
3. **Image and Shape**:
   * **Image**: **Canonical Ubuntu 24.04** or **22.04 Minimal/Standard** (Recommended).
   * **Shape**: **AMD Compute** -> `VM.Standard.E2.1.Micro` (Always Free Eligible, 1 OCPU, 1 GB RAM).
4. **Networking**: Select or create a Virtual Cloud Network (VCN) with a Public Subnet and assign a public IPv4 address.
5. **Add SSH Keys**: Generate a new key pair or paste your existing public SSH key. Download the private key (e.g. `oracle_key.pem`).
6. Click **Create** and wait for the instance state to change to **Running**.
7. Note down the **Public IP Address** of your instance.

---

## 3. Configure Oracle VCN Ingress Rules (Ports 80 & 443)

> **Important**: In Oracle Cloud, you must explicitly allow incoming HTTP and HTTPS traffic in your subnet's Security List.

1. In the OCI Console, go to **Networking** > **Virtual Cloud Networks**.
2. Click your VCN > **Security Lists** > click **Default Security List for `<your-vcn>`**.
3. Under **Ingress Rules**, click **Add Ingress Rules**:
   * **Rule 1 (HTTP)**:
     * Source CIDR: `0.0.0.0/0`
     * IP Protocol: `TCP`
     * Destination Port Range: `80`
     * Description: `Allow HTTP`
   * **Rule 2 (HTTPS)**:
     * Source CIDR: `0.0.0.0/0`
     * IP Protocol: `TCP`
     * Destination Port Range: `443`
     * Description: `Allow HTTPS`
4. Click **Add Ingress Rules**.

---

## 4. Run Initial VM Provisioning Script

1. Connect to your instance via SSH:
   ```bash
   ssh -i /path/to/oracle_key.pem ubuntu@<YOUR_VM_PUBLIC_IP>
   ```

2. Clone this repository or copy `scripts/setup-oracle-vm.sh` to the VM:
   ```bash
   # Download the setup script directly or clone your repo
   git clone https://github.com/1997Buhuti/MEAN_ecommerce_backend.git /tmp/repo
   cd /tmp/repo
   sudo bash scripts/setup-oracle-vm.sh
   ```

   The script automatically:
   * Creates a **2 GB Swap file** and tunes swappiness.
   * Installs **Node.js 22 LTS**, **Nginx**, and **PM2**.
   * Installs `pm2-logrotate` (keeps log files manageable on disk).
   * Configures local firewall (`ufw` and `iptables`) for ports 22, 80, and 443.
   * Creates the app folder at `/var/www/mean_ecommerce_backend`.
   * Configures PM2 to start automatically on VM reboot.

---

## 5. Configure Nginx

1. Copy the Nginx configuration template:
   ```bash
   sudo cp /tmp/repo/nginx/mean-ecommerce.conf /etc/nginx/sites-available/mean-ecommerce.conf
   ```

2. (Optional) If you have a custom domain name, edit `server_name`:
   ```bash
   sudo nano /etc/nginx/sites-available/mean-ecommerce.conf
   # Replace `server_name _;` with `server_name api.yourdomain.com;`
   ```

3. Enable the site and test configuration:
   ```bash
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo ln -sf /etc/nginx/sites-available/mean-ecommerce.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 6. Create Environment File on the Server

Create `/var/www/mean_ecommerce_backend/.env` with your production secrets:

```bash
cat << 'EOF' > /var/www/mean_ecommerce_backend/.env
PORT=3000
NODE_ENV=production
API_URI=/api/v
CONNECTION_STRING=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
SECRET=your-super-secret-jwt-key-min-16-characters-long
EOF
chmod 600 /var/www/mean_ecommerce_backend/.env
```

---

## 7. Setup GitHub Actions CI/CD Pipeline

To enable automated deployments on every `git push origin main`:

1. In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret** and add the following:

| Secret Name | Value | Description |
| :--- | :--- | :--- |
| `SERVER_HOST` | `<YOUR_VM_PUBLIC_IP>` | The public IP of your Oracle VM |
| `SERVER_USER` | `ubuntu` | The default SSH user (usually `ubuntu`) |
| `SSH_PRIVATE_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | The entire content of your private SSH key (`oracle_key.pem`) |
| `SERVER_PORT` | `22` *(Optional)* | SSH port (defaults to 22 if not set) |

3. Push any commit to the `main` branch or manually trigger the workflow from the **Actions** tab.
4. GitHub Actions will test, build, sync the bundle to your VM, install production dependencies, and reload PM2!

---

## 8. (Optional) Enable Free HTTPS with Let's Encrypt / Certbot

Once your domain DNS `A` record points to your Oracle VM public IP:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

Certbot will automatically install the SSL certificates and configure HTTPS redirects in Nginx.

---

## 9. Useful Monitoring & Troubleshooting Commands

```bash
# Check PM2 process status
pm2 status

# View live application logs
pm2 logs mean-ecommerce-api

# Check memory and CPU usage
pm2 monit
# or
htop
free -m

# Restart or reload the app manually
pm2 reload ecosystem.config.cjs --update-env

# Test Nginx configuration
sudo nginx -t

# View Nginx access / error logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```
