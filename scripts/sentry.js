// const SentryCli = require('@sentry/cli');
// async function createReleaseAndUpload() {
//   const release = process.env.REACT_APP_SENTRY_RELEASE;
//   if (!release) {
//     return;
//   }
//   const cli = new SentryCli();
//   try {
 
//     await cli.releases.new(release);
//     await cli.releases.uploadSourceMaps(release, {
//       include: ['build/static/js'],
//       urlPrefix: '~/static/js',
//       rewrite: false,
//     });
//     await cli.releases.finalize(release);
//   } catch (e) {
//     console.error('Source maps uploading failed:', e);
//   }
// }
// createReleaseAndUpload();
    // "release": "(export REACT_APP_SENTRY_RELEASE=$(git rev-parse --short HEAD); react-app-rewired --max_old_space_size=4096 build && node scripts/sentry.js)",