const { cyan, red, magenta, yellow } = require('colors');
const fs = require('fs');

const path = require('path');
const ytdl = require('@distube/ytdl-core');
const prog = require('progress');

const args = process.argv.slice(2);
let url = '', ext = 'm4a', dir = 'C:\\Users\\awe\\Music';

const opt = (i) => args.indexOf(i);
const arg = (i) => args[opt(i) + 1];

url = opt('-u') > -1 ? (arg('-u') ? arg('-u') : url) : (args[0] || url);
ext = opt('-e') > -1 ? (arg('-e') ? arg('-e') : ext) : ext;
dir = opt('-d') > -1 ? (arg('-d') ? arg('-d') : dir) : dir;

if(opt('clear') > -1) {
  console.clear();
  return console.log(cyan('>>'), 'Console Cleared\n');
}

const url_filter = new RegExp('^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+').test(url);
if(!url_filter) {
  console.error(red('>>'), 'Please provide a valid YouTube video link\n');
  return process.exit(1);
}

const time = async(time) => {
  const min = Math.floor(time / 60);
  // const hr = Math.floor(time / 3600);

  const result = `${min} ${min > 1 ? 'mins' : 'min'} ${time > 60 ? time - min * 60 : time} sec`;
  return result;
}

const downloader = async(url, ext, dir) => {
  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/<|>|:|"|\||\/|\\|\||\?|\*/gi, '');
    const fp = path.join(dir, `${title}.${ext}`);

    console.log(`\n ${magenta('>>')} ----------- ${magenta(ext)}
    title       ${info.videoDetails.title}
    author      ${info.videoDetails.author.name}
    length      ${await time(info.videoDetails.lengthSeconds)}
    `)

    let start = Date.now();
    const progress = new prog(`${cyan('>>')} :percent [:bar] :etas`, {
      width: 36,
      incomplete: '-',
      complete: '/',
      renderThrottle: 100,
      total: parseInt(info.videoDetails.lengthSeconds)
    });

    const vft = ['mp4', 'mkv'];
    const aft = ['m4a', 'opus'];

    const stream = {};
    if(vft.some((ft) => ext.includes(ft))) {
      console.log(yellow('>>'), 'Video is likely to not have audio embedded!')
      stream.video = ytdl(url, { 
        filter: 'videoonly',
        quality: 'highestvideo',
        format: ext
      });

      stream.video.on('progress', (chunk, isDown, total) => {
        const percent = isDown / total;
        progress.update(percent, { etas: (Date.now() - start) * (1 - percent) / percent / 1000 });
      })

      stream.video.pipe(fs.createWriteStream(fp).on('finish', () => {
        console.log(cyan('>>'), `Completed.\n`);
      }))
    } else if(aft.some((ft) => ext.includes(ft))) {
      stream.audio = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        format: ext
      });

      stream.audio.on('progress', (chunk, isDown, total) => {
        const percent = isDown / total;
        progress.update(percent, { etas: (Date.now() - start) * (1 - percent) / percent / 1000 });
      })

      stream.audio.pipe(fs.createWriteStream(fp).on('finish', () => {
        console.log(cyan('>>'), `Completed.\n`);
      }))
    } else {
      return console.warn(yellow('>>'), `Retry with a valid format from below!\n   ${magenta('video')} ${vft.toString().replace(',', ' ')}\n   ${magenta('audio')} ${aft.toString().replace(',', ' ')}\n`);
    }
  } catch (err) {
    console.error(red('>>'), 'YTDL:', err.message + '\n');
  }
};

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

downloader(url, ext, dir);
