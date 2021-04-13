import React, {useState, useEffect, useRef} from 'react';
import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartGroup,
  ChartLegend,
  ChartThemeColor,
  ChartThreshold,
  ChartVoronoiContainer
} from '@patternfly/react-charts';
import chart_color_blue_300 from '@patternfly/react-tokens/dist/js/chart_color_blue_300';
import chart_color_orange_300 from '@patternfly/react-tokens/dist/js/chart_color_orange_300';
import chart_color_green_300 from '@patternfly/react-tokens/dist/js/chart_color_green_300';
import chart_color_blue_500 from '@patternfly/react-tokens/dist/js/chart_color_blue_500';
import chart_color_orange_500 from '@patternfly/react-tokens/dist/js/chart_color_orange_500';
import chart_color_green_500 from '@patternfly/react-tokens/dist/js/chart_color_green_500';
import chart_color_blue_100 from '@patternfly/react-tokens/dist/js/chart_color_blue_100';
import chart_color_orange_100 from '@patternfly/react-tokens/dist/js/chart_color_orange_100';
import chart_color_green_100 from '@patternfly/react-tokens/dist/js/chart_color_green_100';
import chart_color_black_300 from '@patternfly/react-tokens/dist/js/chart_color_black_300';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export type Broker = {
  name: string
  data: {
    timestamp: number
    usedSpace: number
    softLimit: number
  }[]
}

export type ChartData = {
  color: string
  softLimitColor: string
  area: BrokerChartData[]
  softLimit: BrokerChartData[]
}

export type BrokerChartData = {
  name: string
  x: string
  y: number 
}

export type LegendData = {
  name: string
  symbol: {}
}

export type AvailableDiskSpaceChartProps = {
  brokers: Broker[]
}

export const AvailableDiskSpaceChart = (brokers: AvailableDiskSpaceChartProps) => {

  console.log('what is brokers' + JSON.stringify(brokers));

  const containerRef = useRef();

  const { t } = useTranslation();
  const [width, setWidth] = useState();
  const [legend, setLegend] = useState([])
  const [chartData, setChartData] = useState<ChartData[]>([] as ChartData[]);
  const itemsPerRow = 4;

  const colors = [chart_color_blue_300.value, chart_color_orange_300.value, chart_color_green_300.value];
  const softLimitColors = [chart_color_blue_100.value, chart_color_orange_100.value, chart_color_green_100.value];

  const handleResize = () => containerRef.current && setWidth(containerRef.current.clientWidth);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  }, [width]);

  useEffect(() => {
    getChartData();
  }, []);

  const getChartData = () => {
    let legendData: Array<LegendData> = [{name: 'Limit', symbol: { fill: chart_color_black_300.value, type: 'threshold'}}];
    let chartData: Array<ChartData> = [];
  
    brokers.brokers.map((broker, index) => {
      console.log('HELLO what is broker' + JSON.stringify(broker));
      const color = colors[index];
      const softLimitColor = softLimitColors[index];
      const softLimitName = `${broker.name} limit`;

      legendData.push({
        name: broker.name.charAt(0).toUpperCase() + broker.name.slice(1),
        symbol: {
          fill: color
        }
      });
      // legendData.push({
      //   name: softLimitName,
      //   symbol: {
      //     type: 'threshold',
      //     fill: softLimitColor
      //   }
      // });
      let area: Array<BrokerChartData> = [];
      let softLimit: Array<BrokerChartData> = [];
      broker.data.map(value => {
        const date = new Date(value.timestamp);
        const time = format(date, 'hh:mm');
        area.push({ name: broker.name, x: time, y: (value.usedSpace / 1024 / 1024 / 1024) * -1 });
        softLimit.push({ name: softLimitName, x: time, y: 20 });
      });
      chartData.push({ color, softLimitColor, area, softLimit });
    });
    setLegend(legendData);
    setChartData(chartData);
  }

    return (
      <>
      {chartData && legend && (
        <div ref={containerRef}>
          <Chart
            ariaDesc={t('metrics.available_disk_space_per_broker')}
            ariaTitle="Disk Space"
            containerComponent={
              <ChartVoronoiContainer
                labels={({ datum }) => `${datum.name}: ${datum.y}`}
                constrainToVisibleArea
              />
            }
            legendPosition="bottom-left"
            legendComponent={
              <ChartLegend
                data={legend}
                itemsPerRow={itemsPerRow}
              />
            }
            height={300}
            padding={{
              bottom: 80, // Adjusted to accomodate legend
              left: 60,
              right: 0,
              top: 25
            }}
            themeColor={ChartThemeColor.multiUnordered}
            width={width}
          >
            <ChartAxis label={'Time'} tickCount={5} />
            <ChartAxis
              dependentAxis
              tickFormat={(t) => `${Math.round(t)} Gi`}
            />
            <ChartGroup>
              {chartData.map((value, index) => (
                <ChartArea
                  key={`chart-area-${index}`}
                  data={value.area}
                  interpolation="monotoneX"
                  style={{
                    data: {
                      stroke: value.color
                    }
                  }}
                />
              ))}
            </ChartGroup>
            {chartData.map((value, index) => (
              <ChartThreshold
                key={`chart-softlimit-${index}`}
                data={value.softLimit}
                style={{
                  data: {
                    stroke: value.softLimitColor
                  }
                }}
              />
            ))}
          </Chart>
        </div>
        )}
      </>
    );
  }
