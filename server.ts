import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { TEA_REGIONS, getRegionById } from './src/utils/terroirLogic.ts';
import {
  generateCuratedTeaProfile,
  generateCuratedTeaWhisperPoster,
  NICHE_TEA_CATALOG,
} from './src/utils/teaProfileLogic.ts';
import { generateCuratedPosterData, getSensoryForPairedTea } from './src/utils/posterLogic.ts';
import { generateCuratedMoodMemo } from './src/utils/courtesyNotificationLogic.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// AI Tea Terroir Sensory Profile API
app.post('/api/tea-terroir/sensory', async (req, res) => {
  try {
    const { regionId } = req.body;
    const region = getRegionById(regionId);

    if (!ai || !process.env.GEMINI_API_KEY) {
      // Return curated authentic profile when API key is not configured
      return res.json({
        success: true,
        source: 'curated',
        profile: region.defaultProfile,
      });
    }

    const prompt = `你是一位精通中国东方茶道、风土学（Terroir）与感官品评的资深品茗宗师。
请针对产区【${region.name}】（代表茗茶：${region.signatureTea}，海拔：${region.altitude}，土壤：${region.soil}，微气候：${region.climate}）撰写一份具有高雅东方文学审美的感官香气图谱。

请严格输出 JSON 格式（不要添加 markdown 格式外壳或额外说明），包含以下字段：
{
  "tagline": "一句15字以内的东方禅意诗意题记，如「臻山川精英秀气所钟，岩骨花香深藏谷壑。」",
  "poeticVision": "一段80-120字的优美东方意象散文，描摹该茶山的晨雾、地貌、古树与茶气交融之境。",
  "terroirEssence": "一段60-90字的风土科学与感官分析，解构海拔、土壤砾质与阳光如何转化为独特风味物质。",
  "radarScores": {
    "aroma": 85到99之间的整数,
    "mineralBody": 80到99之间的整数,
    "sweetness": 85到99之间的整数,
    "mouthfeel": 85到99之间的整数,
    "throatDepth": 85到99之间的整数
  },
  "notes": {
    "top": "迎鼻初香（如：焙火焦糖香 · 辛锐桂皮幽香）",
    "heart": "啜饮落水香（如：熟成水蜜桃 · 百年青苔木质香）",
    "base": "杯底冷香与喉韵（如：冷杯深沉熟果香 · 挂杯岩矿泉韵久留）"
  },
  "keyAromaDescriptors": ["4-5个四字感官香气词汇"],
  "brewingImpression": "一段50-70字关于冲泡时的真实感官与喉韵体感描摹。"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);

    return res.json({
      success: true,
      source: 'gemini-ai',
      profile: {
        regionId: region.id,
        regionName: region.name,
        teaType: region.signatureTea,
        tagline: parsed.tagline || region.defaultProfile.tagline,
        poeticVision: parsed.poeticVision || region.defaultProfile.poeticVision,
        terroirEssence: parsed.terroirEssence || region.defaultProfile.terroirEssence,
        radarScores: parsed.radarScores || region.defaultProfile.radarScores,
        notes: parsed.notes || region.defaultProfile.notes,
        keyAromaDescriptors: parsed.keyAromaDescriptors || region.defaultProfile.keyAromaDescriptors,
        brewingImpression: parsed.brewingImpression || region.defaultProfile.brewingImpression,
      },
    });
  } catch (error) {
    console.error('Gemini Terroir API error:', error);
    const region = getRegionById(req.body?.regionId);
    return res.json({
      success: true,
      source: 'fallback',
      profile: region.defaultProfile,
    });
  }
});

// AI Personal Tea Character Dossier & Radar Analysis API
app.post('/api/tea-profile/analyze', async (req, res) => {
  try {
    const { orders = [], reviews = [], tastingTags = [] } = req.body;
    const fallbackProfile = generateCuratedTeaProfile(orders, reviews, tastingTags);

    if (!ai || !process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        source: 'curated-engine',
        data: fallbackProfile,
      });
    }

    const orderNames = orders.map((o: { name: string }) => o.name).join('、') || '暂无购买记录（初入茶席）';
    const reviewTexts = reviews.length > 0 ? reviews.join('；') : '用户注重茶汤醇和感、喉韵深沉与回甘持久度';
    const tagsStr = tastingTags.join('、') || '重焙老火、岩骨厚实、舌底生津';

    const prompt = `你是一位深谙东方茶道、紫砂器物鉴藏与中式工夫茶感官审美的顶级品茗大师。
现有一位春城嘉叶的高阶茶友，其近期茶事数据如下：
- 购买茶叶/茶器历史：${orderNames}
- 历史品评记录：${reviewTexts}
- 用户自选口感偏好标签：${tagsStr}

请为该茶友生成一份专属的「个人茶性档案」，解构其在东方工夫茶五维感官中的独特偏好，并为其量身推荐契合其口味的冷门小众珍罕好茶。
五维体系包含：
1. roast: 焙火火候 (50-98整数)
2. aroma: 香扬高扬 (50-98整数)
3. sweetness: 回甘生津 (50-98整数)
4. mouthfeel: 稠滑醇厚 (50-98整数)
5. throatCharm: 喉韵岩气 (50-98整数)

请严格输出 JSON 格式（不要添加 markdown 或任何额外包裹说明），格式如下：
{
  "characterTitle": "8字以内的东方禅意茶性格言雅号，如「深谷苍苔 · 岩骨清客」或「高山流云 · 探幽香客」",
  "characterBadge": "8字以内的特质标签，如「骨力深沉 · 韵致入髓」",
  "philosophy": "一段80-120字的优美东方散文，剖析该茶友的口感基因与茶道修持意境。",
  "radarScores": {
    "roast": 85,
    "aroma": 88,
    "sweetness": 90,
    "mouthfeel": 92,
    "throatCharm": 94
  },
  "tastingAdvice": "一段40-60字关于器皿搭配与水温冲泡手法的针对性雅训。",
  "recommendationAdjustments": [
    {
      "nicheId": "niche-baijiguan 或 niche-tongtianxiang 或 niche-tianmenshan 或 niche-wild-black",
      "customReason": "针对该茶友特别定制的品鉴契合理由（50字内）",
      "boostScore": 96
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);

    // Merge AI output with curated catalog
    const adjustedTeas = fallbackProfile.recommendedTeas.map((tea) => {
      const match = parsed.recommendationAdjustments?.find((adj: { nicheId: string }) => adj.nicheId === tea.id);
      if (match) {
        return {
          ...tea,
          matchReason: match.customReason || tea.matchReason,
          matchScore: typeof match.boostScore === 'number' ? match.boostScore : tea.matchScore,
        };
      }
      return tea;
    });

    return res.json({
      success: true,
      source: 'gemini-ai',
      data: {
        characterTitle: parsed.characterTitle || fallbackProfile.characterTitle,
        characterBadge: parsed.characterBadge || fallbackProfile.characterBadge,
        philosophy: parsed.philosophy || fallbackProfile.philosophy,
        radar: {
          roast: parsed.radarScores?.roast ?? fallbackProfile.radar.roast,
          aroma: parsed.radarScores?.aroma ?? fallbackProfile.radar.aroma,
          sweetness: parsed.radarScores?.sweetness ?? fallbackProfile.radar.sweetness,
          mouthfeel: parsed.radarScores?.mouthfeel ?? fallbackProfile.radar.mouthfeel,
          throatCharm: parsed.radarScores?.throatCharm ?? fallbackProfile.radar.throatCharm,
        },
        recentTastingTags: tastingTags.length > 0 ? tastingTags : fallbackProfile.recentTastingTags,
        recommendedTeas: adjustedTeas,
        tastingAdvice: parsed.tastingAdvice || fallbackProfile.tastingAdvice,
      },
    });
  } catch (error) {
    console.error('Gemini Tea Profile API error:', error);
    const { orders = [], reviews = [], tastingTags = [] } = req.body;
    return res.json({
      success: true,
      source: 'fallback',
      data: generateCuratedTeaProfile(orders, reviews, tastingTags),
    });
  }
});

// AI Tea Character 5D Radar & Mood Poetry Poster Synthesis API
app.post('/api/tea-profile/whisper-poster', async (req, res) => {
  try {
    const {
      profile,
      moodId = 'pine-mist',
      userName = '林清羽',
      userTierTitle = '掌席茶人 · MASTER',
    } = req.body;

    const safeProfile =
      profile && profile.radar
        ? profile
        : generateCuratedTeaProfile([], [], ['岩骨厚实', '重焙老火', '舌底生津']);
    const fallbackPoster = generateCuratedTeaWhisperPoster(
      safeProfile,
      moodId,
      userName,
      userTierTitle
    );

    if (!ai || !process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        source: 'curated-engine',
        data: fallbackPoster,
      });
    }

    const prompt = `你是一位深谙中国古典诗词与东方工夫茶美学的文人茶道宗师。
现有一位春城嘉叶茶友【${userName}】（身份：${userTierTitle}），其个人茶性档案如下：
- 茶性雅号：${safeProfile.characterTitle}
- 五维茶性分值：焙火 ${safeProfile.radar.roast}分、香扬 ${safeProfile.radar.aroma}分、回甘 ${safeProfile.radar.sweetness}分、稠滑 ${safeProfile.radar.mouthfeel}分、喉韵 ${safeProfile.radar.throatCharm}分
- 舌尖偏好标签：${(safeProfile.recentTastingTags || []).join('、')}
- 当前所选心境主题：${fallbackPoster.moodLabel}

请将用户的五维茶性雷达与心境主题融合，创作一张适合分享至微信朋友圈的「雅致茶语海报」诗文，严格输出 JSON 格式（不要包含 markdown 代码块）：
{
  "poeticTitle": "8字以内的东方雅致茶语标题，如「松风煮雪 · 岩韵入怀」",
  "moodPoem": ["七言绝句第一句（含标点）", "七言绝句第二句（含标点）", "七言绝句第三句（含标点）", "七言绝句第四句（含标点）"],
  "moodReflection": "一段40-65字的茶语心境感悟，结合其最高维度的茶性分值与心境意象。",
  "sealText": "4字篆印闲章，如「松风鉴茶」或「兰芷清赏」"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const customPoem: [string, string, string, string] =
      Array.isArray(parsed.moodPoem) && parsed.moodPoem.length === 4
        ? [parsed.moodPoem[0], parsed.moodPoem[1], parsed.moodPoem[2], parsed.moodPoem[3]]
        : fallbackPoster.moodPoem;

    return res.json({
      success: true,
      source: 'gemini-ai',
      data: {
        ...fallbackPoster,
        poeticTitle: parsed.poeticTitle || fallbackPoster.poeticTitle,
        moodPoem: customPoem,
        moodReflection: parsed.moodReflection || fallbackPoster.moodReflection,
        sealText: parsed.sealText || fallbackPoster.sealText,
      },
    });
  } catch (error) {
    console.error('Gemini Tea Whisper Poster API error:', error);
    const {
      profile,
      moodId = 'pine-mist',
      userName = '林清羽',
      userTierTitle = '掌席茶人 · MASTER',
    } = req.body || {};
    const safeProfile =
      profile && profile.radar
        ? profile
        : generateCuratedTeaProfile([], [], ['岩骨厚实', '重焙老火', '舌底生津']);
    return res.json({
      success: true,
      source: 'fallback',
      data: generateCuratedTeaWhisperPoster(safeProfile, moodId, userName, userTierTitle),
    });
  }
});

// AI Tea Salon Invitation Poster Synthesis API
app.post('/api/salon/invitation-poster', async (req, res) => {
  try {
    const { booking, themeId = 'ink' } = req.body;
    const defaultData = generateCuratedPosterData(booking, themeId);

    if (!ai || !process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        source: 'curated-engine',
        data: defaultData,
      });
    }

    const room = booking?.roomName || '「月藏」茶室';
    const date = booking?.date || '甲辰吉日';
    const timeSlot = booking?.timeSlot || '午席';
    const sommelier = booking?.sommelier || '苏婉';
    const pairedTea = booking?.pairedTea || '三坑两涧·老枞水仙';
    const guests = booking?.guests || 2;

    const prompt = `你是一位精通中国古典诗学、茶道雅集美学与茶席仪轨的文人茶道宗师。
现有一位贵宾在春城嘉叶·私享茶室预定了雅席，信息如下：
- 茶室席所：${room}
- 入席吉日：${date}
- 入席时段：${timeSlot}
- 同行雅士：${guests} 位
- 执席侍茶师：${sommelier}
- 开席选定好茶：${pairedTea}

请为该雅席创作一份用于微信分享的精美东方美学邀约海报文案与感官图谱：
1. poeticTitle: 8字以内的东方禅意海报大标题（如「月照幽席 · 烹泉候君」）
2. invitationVerse: 一首量身定制的七言绝句（4行字符串数组，每行7字加标点，要求意境高古脱俗，融合茶室景致与茶汤之美）
3. teaSensoryRadar: 该茶的五维感官打分 { "aroma": 80-99, "roast": 60-99, "sweetness": 85-99, "body": 85-99, "throatCharm": 85-99 }
4. keyDescriptors: 4个四字感官词汇（如「百年老丛」、「深谷岩骨」、「冷香入骨」、「生津鸣泉」）
5. topNote: 迎面初香（15字内）
6. heartNote: 落水水香与汤感（15字内）
7. baseNote: 喉韵与杯底冷香（15字内）
8. brewingRitual: 一句关于本席侍茶礼仪的唯美雅训（30字内，如「鼎沸纯净山泉，潮州手拉朱泥急出三巡，候客踏露而来。」）
9. sealText: 4字印章篆体字（如「春城雅席」或「客至心安」）

严格以 JSON 格式输出，不要包含 markdown 格式外壳：
{
  "poeticTitle": "...",
  "invitationVerse": ["...", "...", "...", "..."],
  "teaSensoryRadar": { "aroma": 95, "roast": 88, "sweetness": 92, "body": 94, "throatCharm": 96 },
  "keyDescriptors": ["...", "...", "...", "..."],
  "topNote": "...",
  "heartNote": "...",
  "baseNote": "...",
  "brewingRitual": "...",
  "sealText": "春城雅席"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);

    return res.json({
      success: true,
      source: 'gemini-ai',
      data: {
        poeticTitle: parsed.poeticTitle || defaultData.poeticTitle,
        invitationVerse: Array.isArray(parsed.invitationVerse) && parsed.invitationVerse.length === 4
          ? parsed.invitationVerse
          : defaultData.invitationVerse,
        sealText: parsed.sealText || defaultData.sealText,
        teaSensory: {
          teaName: pairedTea,
          category: defaultData.teaSensory.category,
          radarScores: {
            aroma: parsed.teaSensoryRadar?.aroma ?? defaultData.teaSensory.radarScores.aroma,
            roast: parsed.teaSensoryRadar?.roast ?? defaultData.teaSensory.radarScores.roast,
            sweetness: parsed.teaSensoryRadar?.sweetness ?? defaultData.teaSensory.radarScores.sweetness,
            body: parsed.teaSensoryRadar?.body ?? defaultData.teaSensory.radarScores.body,
            throatCharm: parsed.teaSensoryRadar?.throatCharm ?? defaultData.teaSensory.radarScores.throatCharm,
          },
          keyDescriptors: Array.isArray(parsed.keyDescriptors) && parsed.keyDescriptors.length > 0
            ? parsed.keyDescriptors
            : defaultData.teaSensory.keyDescriptors,
          topNote: parsed.topNote || defaultData.teaSensory.topNote,
          heartNote: parsed.heartNote || defaultData.teaSensory.heartNote,
          baseNote: parsed.baseNote || defaultData.teaSensory.baseNote,
        },
        brewingRitual: parsed.brewingRitual || defaultData.brewingRitual,
        hostSignature: '春城嘉叶 · 敬邀',
        generatedAt: defaultData.generatedAt,
      },
    });
  } catch (error) {
    console.error('Gemini Invitation Poster API error:', error);
    const { booking, themeId = 'ink' } = req.body;
    return res.json({
      success: true,
      source: 'fallback',
      data: generateCuratedPosterData(booking, themeId),
    });
  }
});

// AI Tea Rendezvous Mood Memo Generation API
app.post('/api/salon/mood-memo', async (req, res) => {
  try {
    const { booking, moodId = 'pine-leisure', userNote = '' } = req.body;
    const fallbackMemo = generateCuratedMoodMemo(booking, moodId, userNote);

    if (!ai || !process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        source: 'curated-engine',
        data: fallbackMemo,
      });
    }

    const prompt = `你是一位深谙中国古典茶道与宋明文人生活美学的茶事雅集宗师。
贵宾即将于24小时内赴约春城嘉叶私享茶室：
- 预约茶席：${booking?.roomName || '「月藏」'}
- 入席时段：${booking?.date || '明日'} · ${booking?.timeSlot || '午席'}
- 执席侍茶师：${booking?.sommelier || '苏婉'}
- 开席茶品：${booking?.pairedTea || '荒野头春白毫银针'}
- 贵宾所选赴约心境基调：${fallbackMemo.moodLabel}
- 贵宾随笔初稿：${userNote || '愿偷得浮生半日闲'}

请为其润色生成一份高雅隽永的「赴约心境」备忘录，严格以 JSON 格式输出（不要附加 markdown 外壳）：
{
  "poeticNote": "一段60-90字的东方文人随笔心境手记，包含诗意起兴与对即将品饮该茶品的期待。",
  "incensePairing": "推荐席间焚香搭配（12字以内，如「海南沉水香 · 鹅梨帐中香」）",
  "attireTip": "一句得体的赴席衣着与行前雅训（30字以内）"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    return res.json({
      success: true,
      source: 'gemini-ai',
      data: {
        ...fallbackMemo,
        poeticNote: parsed.poeticNote || fallbackMemo.poeticNote,
        incensePairing: parsed.incensePairing || fallbackMemo.incensePairing,
        attireTip: parsed.attireTip || fallbackMemo.attireTip,
      },
    });
  } catch (error) {
    console.error('Gemini Mood Memo API error:', error);
    const { booking, moodId = 'pine-leisure', userNote = '' } = req.body;
    return res.json({
      success: true,
      source: 'fallback',
      data: generateCuratedMoodMemo(booking, moodId, userNote),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Chun Cheng Jia Ye] Server listening on port ${PORT}`);
  });
}

startServer();
