import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { TEA_REGIONS, getRegionById } from './src/utils/terroirLogic.ts';

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
