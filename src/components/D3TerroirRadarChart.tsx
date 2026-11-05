import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  TerroirSensoryProfile,
  TERROIR_RADAR_AXES,
  TerroirRadarAxisMeta,
  getRegionThemeMeta,
  getScoreLevelCN,
} from '../utils/terroirLogic';
import { zenAudio } from '../utils/audioZen';

interface D3TerroirRadarChartProps {
  primaryProfile: TerroirSensoryProfile;
  compareProfile?: TerroirSensoryProfile | null;
  activeAxisKey: keyof TerroirSensoryProfile['radarScores'];
  onSelectAxis: (axis: TerroirRadarAxisMeta) => void;
}

export const D3TerroirRadarChart: React.FC<D3TerroirRadarChartProps> = ({
  primaryProfile,
  compareProfile,
  activeAxisKey,
  onSelectAxis,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [smoothCurve, setSmoothCurve] = useState<boolean>(true);

  const primaryTheme = getRegionThemeMeta(primaryProfile.regionId);
  const compareTheme = compareProfile ? getRegionThemeMeta(compareProfile.regionId) : null;

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const width = 260;
    const height = 250;
    const centerX = width / 2;
    const centerY = height / 2 + 4;
    const maxRadius = 82;
    const numAxes = TERROIR_RADAR_AXES.length;
    const angleSlice = (Math.PI * 2) / numAxes;

    const rScale = d3.scaleLinear().domain([0, 100]).range([0, maxRadius]);

    const svg = d3.select(svgEl);

    // Initialize root group once
    let rootG = svg.select<SVGGElement>('g.d3-terroir-root');
    if (rootG.empty()) {
      rootG = svg
        .append('g')
        .attr('class', 'd3-terroir-root')
        .attr('transform', `translate(${centerX}, ${centerY})`);

      rootG.append('g').attr('class', 'grid-layer');
      rootG.append('g').attr('class', 'axes-layer');
      rootG.append('g').attr('class', 'compare-area-layer');
      rootG.append('g').attr('class', 'primary-area-layer');
      rootG.append('g').attr('class', 'nodes-layer');
      rootG.append('g').attr('class', 'labels-layer');
    }

    // 1. Concentric Grid Rings (25, 50, 75, 100)
    const levels = [25, 50, 75, 100];
    const gridLayer = rootG.select<SVGGElement>('g.grid-layer');

    const gridPolygons = gridLayer.selectAll<SVGPolygonElement, number>('polygon.grid-ring').data(levels);

    gridPolygons
      .enter()
      .append('polygon')
      .attr('class', 'grid-ring')
      .merge(gridPolygons)
      .attr('points', (level) => {
        const r = rScale(level);
        return TERROIR_RADAR_AXES.map((_, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          return `${r * Math.cos(angle)},${r * Math.sin(angle)}`;
        }).join(' ');
      })
      .attr('fill', (level) => (level === 100 ? 'rgba(244, 239, 229, 0.35)' : 'none'))
      .attr('stroke', '#DED5C4')
      .attr('stroke-width', (level) => (level === 100 ? 1.1 : 0.75))
      .attr('stroke-dasharray', (level) => (level === 100 ? 'none' : '2,2'));

    gridPolygons.exit().remove();

    // Score tick labels along top vertical axis
    const gridLabels = gridLayer.selectAll<SVGTextElement, number>('text.grid-tick').data([50, 75, 100]);
    gridLabels
      .enter()
      .append('text')
      .attr('class', 'grid-tick')
      .merge(gridLabels)
      .attr('x', 4)
      .attr('y', (level) => -rScale(level) + 3)
      .attr('font-size', '7px')
      .attr('font-family', 'monospace')
      .attr('fill', '#A69E90')
      .text((level) => `${level}`);
    gridLabels.exit().remove();

    // 2. Axis Rays
    const axesLayer = rootG.select<SVGGElement>('g.axes-layer');
    const axisLines = axesLayer
      .selectAll<SVGLineElement, TerroirRadarAxisMeta>('line.axis-ray')
      .data(TERROIR_RADAR_AXES, (d) => d.key);

    axisLines
      .enter()
      .append('line')
      .attr('class', 'axis-ray')
      .attr('x1', 0)
      .attr('y1', 0)
      .merge(axisLines)
      .attr('x2', (_, i) => rScale(100) * Math.cos(i * angleSlice - Math.PI / 2))
      .attr('y2', (_, i) => rScale(100) * Math.sin(i * angleSlice - Math.PI / 2))
      .attr('stroke', (d) => (d.key === activeAxisKey ? primaryTheme.strokeColor : '#D5CBB8'))
      .attr('stroke-width', (d) => (d.key === activeAxisKey ? 1.6 : 0.9));

    axisLines.exit().remove();

    // Radial Line Generator (D3 lineRadial)
    const radarLine = d3
      .lineRadial<number>()
      .radius((d) => rScale(d))
      .angle((_, i) => i * angleSlice)
      .curve(smoothCurve ? d3.curveCardinalClosed.tension(0.65) : d3.curveLinearClosed);

    const primaryScores = TERROIR_RADAR_AXES.map((a) => primaryProfile.radarScores[a.key]);

    // 3. Secondary Comparison Radar Layer (if active)
    const compareLayer = rootG.select<SVGGElement>('g.compare-area-layer');
    if (compareProfile && compareProfile.regionId !== primaryProfile.regionId && compareTheme) {
      const compareScores = TERROIR_RADAR_AXES.map((a) => compareProfile.radarScores[a.key]);
      const comparePath = compareLayer
        .selectAll<SVGPathElement, number[]>('path.compare-radar-path')
        .data([compareScores]);

      comparePath
        .enter()
        .append('path')
        .attr('class', 'compare-radar-path')
        .attr('d', (d) => radarLine(d) || '')
        .attr('fill', compareTheme.fillColor)
        .attr('stroke', compareTheme.strokeColor)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,3')
        .merge(comparePath)
        .transition()
        .duration(600)
        .ease(d3.easeCubicOut)
        .attr('d', (d) => radarLine(d) || '')
        .attr('fill', compareTheme.fillColor)
        .attr('stroke', compareTheme.strokeColor);

      comparePath.exit().remove();
    } else {
      compareLayer.selectAll('path.compare-radar-path').remove();
    }

    // 4. Primary Terroir Radar Area with D3 Transition
    const primaryLayer = rootG.select<SVGGElement>('g.primary-area-layer');
    const primaryPath = primaryLayer
      .selectAll<SVGPathElement, number[]>('path.primary-radar-path')
      .data([primaryScores]);

    primaryPath
      .enter()
      .append('path')
      .attr('class', 'primary-radar-path')
      .attr('d', (d) => radarLine(d) || '')
      .attr('fill', primaryTheme.fillColor)
      .attr('stroke', primaryTheme.strokeColor)
      .attr('stroke-width', 2.2)
      .merge(primaryPath)
      .transition()
      .duration(650)
      .ease(d3.easeCubicOut)
      .attr('d', (d) => radarLine(d) || '')
      .attr('fill', primaryTheme.fillColor)
      .attr('stroke', primaryTheme.strokeColor);

    primaryPath.exit().remove();

    // 5. Interactive Vertex Nodes
    const nodesLayer = rootG.select<SVGGElement>('g.nodes-layer');
    const nodeData = TERROIR_RADAR_AXES.map((axis, idx) => ({
      axis,
      idx,
      score: primaryProfile.radarScores[axis.key],
    }));

    const circles = nodesLayer
      .selectAll<SVGCircleElement, (typeof nodeData)[0]>('circle.radar-vertex')
      .data(nodeData, (d) => d.axis.key);

    const enteredCircles = circles
      .enter()
      .append('circle')
      .attr('class', 'radar-vertex cursor-pointer')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 4.5);

    enteredCircles
      .merge(circles)
      .on('click', (_, d) => {
        zenAudio.playZenChime();
        onSelectAxis(d.axis);
      })
      .on('mouseenter', (_, d) => {
        onSelectAxis(d.axis);
      })
      .transition()
      .duration(650)
      .ease(d3.easeCubicOut)
      .attr('cx', (d) => rScale(d.score) * Math.cos(d.idx * angleSlice - Math.PI / 2))
      .attr('cy', (d) => rScale(d.score) * Math.sin(d.idx * angleSlice - Math.PI / 2))
      .attr('r', (d) => (d.axis.key === activeAxisKey ? 6 : 4.2))
      .attr('fill', (d) => (d.axis.key === activeAxisKey ? primaryTheme.strokeColor : '#232B26'))
      .attr('stroke', '#FAF8F4')
      .attr('stroke-width', 1.8);

    circles.exit().remove();

    // 6. Interactive Axis Labels around the perimeter
    const labelsLayer = rootG.select<SVGGElement>('g.labels-layer');
    const labelGroups = labelsLayer
      .selectAll<SVGGElement, (typeof nodeData)[0]>('g.axis-label-group')
      .data(nodeData, (d) => d.axis.key);

    const enteredLabels = labelGroups
      .enter()
      .append('g')
      .attr('class', 'axis-label-group cursor-pointer');

    enteredLabels.append('text').attr('class', 'axis-title');
    enteredLabels.append('text').attr('class', 'axis-score');

    const mergedLabels = enteredLabels
      .merge(labelGroups)
      .attr('transform', (d) => {
        const labelR = maxRadius + 24;
        const angle = d.idx * angleSlice - Math.PI / 2;
        const lx = labelR * Math.cos(angle);
        const ly = labelR * Math.sin(angle);
        return `translate(${lx}, ${ly})`;
      })
      .on('click', (_, d) => {
        zenAudio.playZenChime();
        onSelectAxis(d.axis);
      });

    mergedLabels
      .select('text.axis-title')
      .attr('text-anchor', 'middle')
      .attr('y', -3)
      .attr('font-size', '9.5px')
      .attr('font-family', 'serif')
      .attr('font-weight', (d) => (d.axis.key === activeAxisKey ? '700' : '500'))
      .attr('fill', (d) => (d.axis.key === activeAxisKey ? primaryTheme.strokeColor : '#4A4337'))
      .text((d) => d.axis.shortLabel);

    mergedLabels
      .select('text.axis-score')
      .attr('text-anchor', 'middle')
      .attr('y', 9)
      .attr('font-size', '8.5px')
      .attr('font-family', 'monospace')
      .attr('font-weight', '700')
      .attr('fill', (d) => (d.axis.key === activeAxisKey ? primaryTheme.strokeColor : '#8F733E'))
      .text((d) => {
        if (compareProfile && compareProfile.regionId !== primaryProfile.regionId) {
          return `${d.score} / ${compareProfile.radarScores[d.axis.key]}`;
        }
        return `${d.score}分`;
      });

    labelGroups.exit().remove();
  }, [primaryProfile, compareProfile, activeAxisKey, smoothCurve, primaryTheme, compareTheme, onSelectAxis]);

  const activeAxisMeta =
    TERROIR_RADAR_AXES.find((a) => a.key === activeAxisKey) || TERROIR_RADAR_AXES[0];
  const activeScore = primaryProfile.radarScores[activeAxisMeta.key];
  const compareScore =
    compareProfile && compareProfile.regionId !== primaryProfile.regionId
      ? compareProfile.radarScores[activeAxisMeta.key]
      : null;

  return (
    <div className="flex flex-col items-center justify-between bg-[#FAF8F4] p-3.5 rounded-2xl border border-[#ECE5D8] relative space-y-2">
      {/* Top Bar: D3 Mode Switcher & Signature Badge */}
      <div className="w-full flex items-center justify-between text-[10px]">
        <span
          className="px-2 py-0.5 rounded-md font-oriental-serif font-bold"
          style={{
            backgroundColor: primaryTheme.badgeBg,
            color: primaryTheme.badgeText,
          }}
        >
          {primaryTheme.signatureCharm}
        </span>

        <button
          type="button"
          onClick={() => {
            zenAudio.playZenChime();
            setSmoothCurve((prev) => !prev);
          }}
          className="px-2 py-0.5 rounded-md bg-white border border-[#DED6C6] text-[#665E50] hover:border-[#232B26] font-oriental-serif transition-colors"
          title="切换 D3 极坐标曲线渲染模式"
        >
          {smoothCurve ? '水墨流线谱' : '五维折线谱'}
        </button>
      </div>

      {/* Interactive D3 SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox="0 0 260 250"
        className="w-full max-w-[250px] h-auto select-none overflow-visible"
        role="img"
        aria-label={`${primaryProfile.regionName}五维感官风土D3雷达图`}
      />

      {/* Legend when comparing two regions */}
      {compareProfile && compareProfile.regionId !== primaryProfile.regionId && compareTheme && (
        <div className="w-full flex items-center justify-center gap-4 text-[10px] font-oriental-serif pt-0.5 border-t border-[#EFE9DD]">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-xs inline-block"
              style={{ backgroundColor: primaryTheme.strokeColor }}
            />
            <span className="text-[#232B26] font-bold">
              {primaryProfile.regionName.split(' ')[0]}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-xs inline-block border border-dashed"
              style={{
                borderColor: compareTheme.strokeColor,
                backgroundColor: compareTheme.fillColor,
              }}
            />
            <span className="text-[#6E675B]">
              对照：{compareProfile.regionName.split(' ')[0]}
            </span>
          </div>
        </div>
      )}

      {/* Interactive Selected Dimension Inspector Card */}
      <div className="w-full bg-white p-2.5 rounded-xl border border-[#E6DFD1] text-left space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: primaryTheme.strokeColor }}
            />
            <span className="font-oriental-serif text-xs font-bold text-[#1E2320]">
              {activeAxisMeta.label} · {activeAxisMeta.poeticSubtitle}
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-[#8F733E]">
            {activeScore}分 ({getScoreLevelCN(activeScore)})
            {compareScore !== null ? ` | 对照 ${compareScore}分` : ''}
          </span>
        </div>
        <p className="text-[10px] text-[#6B6457] leading-relaxed">
          {activeAxisMeta.spectrumDesc}
        </p>
      </div>
    </div>
  );
};
