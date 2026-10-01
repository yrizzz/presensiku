// Scheduler: DIHAPUS dari PM2. `schedule:work` membuat satu proses PHP hidup terus + satu boot
// framework tiap menit, padahal tugasnya hanya harian/mingguan. Pakai cron sistem saja
// (jalankan `crontab -e` sebagai user web):
//
//   30 2 * * *  cd /www/wwwroot/presensiku.yrizzz.my.id/presensiku && nice -n 10 php artisan schedule:run >> /dev/null 2>&1
//   0  3 * * 1  cd /www/wwwroot/presensiku.yrizzz.my.id/presensiku && nice -n 10 php artisan schedule:run >> /dev/null 2>&1
//
// (attendance:prune-selfies jam 02:30 setiap hari, holidays:sync Senin jam 03:00.)
// Tambahkan entri baru ke jadwal bila routes/console.php menambah tugas.
// Catatan: prioritas CPU rendah bisa diberikan SETELAH start: renice -n 5 -p $(pm2 pid presensiku-queue)
// (membungkus perintah dengan `nice` di PM2 membuat proses crash-loop pada beberapa server).
module.exports = {
  apps: [
    {
      name: "presensiku-reverb",
      script: "artisan",
      args: "reverb:start --host=0.0.0.0 --port=8082",
      interpreter: "php",
      max_memory_restart: "150M",
      cwd: "/www/wwwroot/presensiku.yrizzz.my.id/presensiku",
      autorestart: true,
      watch: false,
      out_file: "./storage/logs/reverb.log",
      error_file: "./storage/logs/reverb-error.log",
    },
    {
      name: "presensiku-queue",
      script: "artisan",
      args: "queue:work --sleep=3 --tries=3 --timeout=90 --max-time=3600 --max-jobs=300 --memory=96",
      interpreter: "php",
      max_memory_restart: "150M",
      cwd: "/www/wwwroot/presensiku.yrizzz.my.id/presensiku",
      autorestart: true,
      watch: false,
      out_file: "./storage/logs/queue.log",
      error_file: "./storage/logs/queue-error.log",
    }
  ]
}
