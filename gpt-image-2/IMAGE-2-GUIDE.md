# GPT Image 2 使用指南

本文记录 OpenAI 官方 Image generation guide 中与 `gpt-image-2` 相关的主要用法，适合作为项目接入时的速查文档。

官方来源：

- Image generation guide: https://developers.openai.com/api/docs/guides/image-generation
- GPT Image 2 model page: https://developers.openai.com/api/docs/models/gpt-image-2
- Pricing: https://developers.openai.com/api/pricing

## 1. 模型定位

`gpt-image-2` 是 OpenAI 当前用于图像生成和图像编辑的 GPT Image 模型。它支持：

- 文本输入生成图片
- 图片输入作为参考生成新图
- 对已有图片做整体或局部编辑
- 高保真处理输入图片
- 灵活的输出尺寸，包括 1K、2K、4K 范围内的多种比例

模型能力边界：

- 输入：文本、图片
- 输出：图片
- 不支持音频、视频输出
- 不支持 function calling、structured outputs、fine-tuning

## 2. 选择 Image API 还是 Responses API

官方 guide 提供两种接入方式。

### Image API

适合一次性生成或编辑图片。核心端点：

- `POST /v1/images/generations`：根据文本 prompt 从零生成图片
- `POST /v1/images/edits`：使用 prompt 修改图片、基于参考图生成图片、或用 mask 局部编辑图片

如果需求是“一个 prompt 生成/编辑一张或多张图”，优先使用 Image API。

### Responses API

适合对话式、多轮、可迭代的图片体验。它通过内置工具 `image_generation` 生成图片，并可以在上下文里继续编辑已有图片。

适合场景：

- 多轮调整图片
- 图片生成与文本推理混合在同一流程中
- 使用 File ID、URL、base64 data URL 等更灵活的图片输入
- 需要从响应中读取 `revised_prompt`

注意：Responses API 里调用的是 `image_generation` 工具，外层主模型应使用官方当前推荐的文本/多模态模型；按 2026-05-23 的官方模型页，示例可使用 `gpt-5.5`。Image API 里则直接指定 `model: "gpt-image-2"`。

## 3. 认证和前置要求

本地或服务端需要配置：

```bash
export OPENAI_API_KEY="your_api_key"
```

使用 GPT Image 系列模型时，组织可能需要先完成 API Organization Verification。若接口返回权限或访问相关错误，应先检查 OpenAI developer console 中的组织验证状态。

## 4. 使用 Image API 生成图片

### Node.js

```js
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

const result = await openai.images.generate({
  model: "gpt-image-2",
  prompt: "A children's book drawing of a veterinarian using a stethoscope to listen to the heartbeat of a baby otter.",
  size: "1024x1024",
  quality: "medium",
});

const imageBase64 = result.data[0].b64_json;
fs.writeFileSync("otter.png", Buffer.from(imageBase64, "base64"));
```

### Python

```python
from openai import OpenAI
import base64

client = OpenAI()

result = client.images.generate(
    model="gpt-image-2",
    prompt="A children's book drawing of a veterinarian using a stethoscope to listen to the heartbeat of a baby otter.",
    size="1024x1024",
    quality="medium",
)

image_base64 = result.data[0].b64_json
with open("otter.png", "wb") as f:
    f.write(base64.b64decode(image_base64))
```

### cURL

```bash
curl -X POST "https://api.openai.com/v1/images/generations" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "A childrens book drawing of a veterinarian using a stethoscope to listen to the heartbeat of a baby otter.",
    "size": "1024x1024",
    "quality": "medium"
  }' | jq -r '.data[0].b64_json' | base64 --decode > otter.png
```

## 5. 使用 Responses API 生成图片

Responses API 适合把图片生成放进多轮对话或工作流。

```js
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.5",
  input: "Generate an image of a gray tabby cat hugging an otter with an orange scarf",
  tools: [{ type: "image_generation" }],
});

const imageOutputs = response.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageOutputs.length > 0) {
  fs.writeFileSync("otter.png", Buffer.from(imageOutputs[0], "base64"));
}
```

Responses API 中，主模型可能会自动优化 prompt。可以从 `image_generation_call.revised_prompt` 读取优化后的 prompt，用于调试和复现。

## 6. 编辑图片

`/v1/images/edits` 支持三类用法：

- 修改已有图片
- 使用一张或多张图片作为参考生成新图片
- 上传原图和 mask，只替换 mask 指定区域

### 使用参考图生成新图片

Node.js 示例：

```js
import OpenAI, { toFile } from "openai";
import fs from "fs";

const openai = new OpenAI();

const result = await openai.images.edit({
  model: "gpt-image-2",
  image: [
    await toFile(fs.createReadStream("body-lotion.png"), null, { type: "image/png" }),
    await toFile(fs.createReadStream("soap.png"), null, { type: "image/png" }),
  ],
  prompt: "Generate a photorealistic gift basket on a white background containing the products from the reference images.",
  size: "1024x1024",
});

fs.writeFileSync("gift-basket.png", Buffer.from(result.data[0].b64_json, "base64"));
```

### 使用 mask 局部编辑

```js
import OpenAI, { toFile } from "openai";
import fs from "fs";

const openai = new OpenAI();

const result = await openai.images.edit({
  model: "gpt-image-2",
  image: await toFile(fs.createReadStream("sunlit_lounge.png"), null, {
    type: "image/png",
  }),
  mask: await toFile(fs.createReadStream("mask.png"), null, {
    type: "image/png",
  }),
  prompt: "A sunlit indoor lounge area with a pool containing a flamingo",
});

fs.writeFileSync("lounge.png", Buffer.from(result.data[0].b64_json, "base64"));
```

Mask 要求：

- 原图和 mask 必须格式一致、尺寸一致
- 文件大小小于 50MB
- mask 必须包含 alpha channel

## 7. 输入图片保真度

`input_fidelity` 用于控制编辑或参考图工作流中保留输入图片细节的程度。

对 `gpt-image-2`，不要传 `input_fidelity`。官方 guide 说明该模型会自动以高保真方式处理每张输入图片，API 不允许修改该参数。

这也意味着：包含参考图或编辑图的请求可能消耗更多 image input tokens。

## 8. 输出参数

常用参数：

| 参数 | 说明 | 常用值 |
| --- | --- | --- |
| `size` | 输出图片尺寸 | `auto`, `1024x1024`, `1536x1024`, `1024x1536`, `2048x2048`, `3840x2160` |
| `quality` | 渲染质量 | `auto`, `low`, `medium`, `high` |
| `output_format` | 输出格式 | `png`, `jpeg`, `webp` |
| `output_compression` | JPEG/WebP 压缩比例 | `0` 到 `100` |
| `background` | 背景模式 | `auto`, opaque 相关设置 |
| `n` | 一次返回多张图片 | 正整数，默认 1 |
| `moderation` | 内容审核严格度 | `auto`, `low` |

### 尺寸约束

`gpt-image-2` 支持灵活尺寸，但必须满足：

- 最大边长不超过 `3840px`
- 宽和高都必须是 `16px` 的倍数
- 长边和短边比例不超过 `3:1`
- 总像素数不少于 `655,360`，不超过 `8,294,400`

常见尺寸：

- `1024x1024`：方图
- `1536x1024`：横图
- `1024x1536`：竖图
- `2048x2048`：2K 方图
- `2048x1152`：2K 横图
- `3840x2160`：4K 横图
- `2160x3840`：4K 竖图
- `auto`：默认自动选择

超过 `2560x1440` 总像素的 2K 以上输出在官方 guide 中标记为 experimental。

### 质量选择

- `low`：适合快速草稿、缩略图、迭代预览，速度最快
- `medium`：适合普通可用资产
- `high`：适合最终资产或更高质量要求
- `auto`：默认，由模型按 prompt 自动选择

### 输出格式

Image API 返回 base64 图片数据。默认格式是 `png`，也可以指定 `jpeg` 或 `webp`。

如果关注延迟，官方 guide 建议优先考虑 `jpeg`，因为它通常比 `png` 更快。使用 `jpeg` 或 `webp` 时，可以通过 `output_compression` 控制压缩比例。

注意：`gpt-image-2` 当前不支持透明背景。不要向该模型发送 `background: "transparent"`。

## 9. 成本和延迟

成本由以下部分组成：

- prompt 的文本输入 tokens
- 编辑或参考图请求中的图片输入 tokens
- 图片输出 tokens

`gpt-image-2` 的输出 token 数取决于 `quality` 和 `size`。官方 guide 建议用 image generation calculator 或 pricing 页面估算成本。

实践建议：

- 草稿阶段使用 `quality: "low"` 和较小尺寸
- 最终出图再切换到 `medium` 或 `high`
- 编辑和参考图工作流要额外估算 image input tokens
- 复杂 prompt 可能需要更长时间，官方 guide 提到复杂请求可能耗时最多约 2 分钟

## 10. 已知限制

官方 guide 提到 GPT Image 模型仍有这些限制：

- 延迟：复杂 prompt 可能处理较久
- 文字渲染：虽然能力提升，但精确文字位置和清晰度仍可能不稳定
- 一致性：多次生成中，角色或品牌元素的一致性可能偶尔漂移
- 构图控制：对严格布局、精确元素位置的控制仍可能不完全可靠

## 11. 推荐接入策略

1. 单次生成或编辑：使用 Image API，并直接指定 `model: "gpt-image-2"`。
2. 多轮图片工作流：使用 Responses API + `image_generation` 工具。
3. 草稿阶段：`quality: "low"`、较小 `size`、必要时 `jpeg`。
4. 最终资产：提高到 `medium` 或 `high`，并明确尺寸。
5. 参考图和局部编辑：注意输入图片 token 成本，以及 mask 的尺寸、格式、alpha channel 要求。
6. 对需要稳定文字和精确版式的任务，预留人工检查或多次重试流程。
