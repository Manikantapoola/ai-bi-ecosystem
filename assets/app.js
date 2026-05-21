// AI-BI Intelligent Ecosystem Dashboard JavaScript Core

// Global State
const state = {
  activeTab: 'dashboard',
  gpuLoad: 48,
  memLatency: 18,
  successRate: 99.4,
  avgLatency: 242,
  queryCount: 14242,
  tempSetting: 0.7,
  bufferSetting: 90,
  isExtremeLoad: false,
  charts: {}
};

// Initialize Lucide Icons on Load
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initCharts();
  startMetricSimulators();
  generateInitialLogs();
  
  // Keep scrolling console logs to the bottom
  const consoleElem = document.getElementById('pipeline-logs-console');
  if (consoleElem) consoleElem.scrollTop = consoleElem.scrollHeight;
});

// View Tab Switching System
function switchTab(tabId) {
  state.activeTab = tabId;
  
  // Hide all sections
  const sections = ['dashboard', 'pipelines', 'analytics', 'settings'];
  sections.forEach(sec => {
    document.getElementById(`view-${sec}`).classList.add('hidden');
    
    // Remove active class from buttons
    const btn = document.getElementById(`btn-${sec}`);
    if (btn) {
      btn.className = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group text-slate-400 hover:text-white hover:bg-slate-800/40";
    }
  });
  
  // Show target section
  document.getElementById(`view-${tabId}`).classList.remove('hidden');
  
  // Highlight target button
  const activeBtn = document.getElementById(`btn-${tabId}`);
  if (activeBtn) {
    activeBtn.className = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group active-tab";
  }
  
  // Trigger chart redraws if necessary
  if (tabId === 'analytics') {
    setTimeout(renderAnalyticsCharts, 50);
  }
}

// Chart Initializers
function initCharts() {
  const ctxDashboard = document.getElementById('chart-dashboard');
  if (!ctxDashboard) return;
  
  // Dashboard Line Chart Area Gradient
  const gradientPurple = ctxDashboard.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradientPurple.addColorStop(0, 'rgba(124, 58, 237, 0.4)');
  gradientPurple.addColorStop(1, 'rgba(124, 58, 237, 0.0)');
  
  const gradientCyan = ctxDashboard.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradientCyan.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
  gradientCyan.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

  state.charts.dashboard = new Chart(ctxDashboard, {
    type: 'line',
    data: {
      labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
      datasets: [
        {
          label: 'AI Inference Engines',
          data: [1200, 1420, 1100, 1900, 2400, 2100, 2800],
          borderColor: '#7C3AED',
          borderWidth: 2,
          backgroundColor: gradientPurple,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#7C3AED',
        },
        {
          label: 'Data Sync Pipelines',
          data: [700, 950, 800, 1300, 1600, 1450, 1850],
          borderColor: '#06B6D4',
          borderWidth: 2,
          backgroundColor: gradientCyan,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: '#06B6D4',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#94A3B8',
            font: { family: 'Inter', size: 11, weight: '500' },
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: '#0F172A',
          titleColor: '#F8FAFC',
          bodyColor: '#94A3B8',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          titleFont: { family: 'Outfit', weight: 'bold' },
          bodyFont: { family: 'Inter' }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748B', font: { family: 'Inter', size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#64748B', font: { family: 'Inter', size: 10 } }
        }
      }
    }
  });
}

function renderAnalyticsCharts() {
  const ctxAnalytics1 = document.getElementById('chart-analytics-1');
  const ctxAnalytics2 = document.getElementById('chart-analytics-2');
  
  if (!ctxAnalytics1 || !ctxAnalytics2) return;
  
  // Avoid re-initializing to prevent canvas glitching
  if (state.charts.analytics1) state.charts.analytics1.destroy();
  if (state.charts.analytics2) state.charts.analytics2.destroy();
  
  // Custom Latency Distribution Chart (Bar)
  state.charts.analytics1 = new Chart(ctxAnalytics1, {
    type: 'bar',
    data: {
      labels: ['Data Extractor', 'Sentiment Analyzer', 'Forecasting Engine', 'BI Insights Node'],
      datasets: [{
        label: 'Latency (ms)',
        data: [42, 68, 112, 20],
        backgroundColor: [
          'rgba(124, 58, 237, 0.75)',
          'rgba(6, 182, 212, 0.75)',
          'rgba(16, 185, 129, 0.75)',
          'rgba(244, 63, 94, 0.75)'
        ],
        borderRadius: 8,
        borderWidth: 0,
        barPercentage: 0.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748B', font: { family: 'Inter', size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#64748B', font: { family: 'Inter', size: 10 } }
        }
      }
    }
  });
  
  // Doughnut Chart for GPU share
  state.charts.analytics2 = new Chart(ctxAnalytics2, {
    type: 'doughnut',
    data: {
      labels: ['Extraction', 'Sentiment', 'Forecasting', 'Insights'],
      datasets: [{
        data: [25, 20, 40, 15],
        backgroundColor: [
          '#7C3AED',
          '#06B6D4',
          '#10B981',
          '#F43F5E'
        ],
        borderColor: '#060B13',
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#94A3B8',
            font: { family: 'Inter', size: 10, weight: '500' },
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true
          }
        }
      }
    }
  });
}

// Live Metric Simulators
function startMetricSimulators() {
  setInterval(() => {
    // 1. Success Rate fluctuations
    state.successRate = (99.3 + Math.random() * 0.25).toFixed(2);
    document.getElementById('metric-success').innerText = `${state.successRate}%`;
    
    // 2. Avg Latency fluctuations
    const baseLatency = state.isExtremeLoad ? 385 : 242;
    state.avgLatency = Math.floor(baseLatency + (Math.random() * 10 - 5));
    document.getElementById('metric-latency').innerText = `${state.avgLatency}ms`;
    
    // 3. Increment total queries slowly
    state.queryCount += Math.floor(Math.random() * 3 + 1);
    document.getElementById('metric-queries').innerText = state.queryCount.toLocaleString();
    
    // 4. Fluctuating Sidebar system bars
    if (!state.isExtremeLoad) {
      state.gpuLoad = Math.floor(45 + Math.random() * 8);
      document.getElementById('load-gpu').innerText = `${state.gpuLoad}%`;
      document.getElementById('bar-gpu').style.width = `${state.gpuLoad}%`;
    }
    
    state.memLatency = Math.floor(16 + Math.random() * 4);
    document.getElementById('load-mem').innerText = `${state.memLatency}ms`;
    document.getElementById('bar-mem').style.width = `${state.memLatency * 1.8}%`;
    
    // 5. Append random background logs to pipeline console
    if (state.activeTab === 'pipelines' && Math.random() > 0.6) {
      appendRandomLog();
    }
    
    // 6. Update main dashboard line chart live
    if (state.charts.dashboard && state.activeTab === 'dashboard') {
      const dataset = state.charts.dashboard.data.datasets[0].data;
      dataset.shift();
      dataset.push(dataset[dataset.length - 1] + Math.floor(Math.random() * 200 - 100));
      state.charts.dashboard.update('none');
    }
  }, 3000);
}

// Pipeline Logger Systems
const mockLogs = [
  { agent: "DataExtractor", text: "Staging buffer refresh triggered...", type: "info" },
  { agent: "SentimentEngine", text: "Successfully completed tensor run for ID #8129", type: "success" },
  { agent: "ForecastingNode", text: "Computing time-series delta weights...", type: "info" },
  { agent: "VisualInsights", text: "Vector graphic asset updated. Cache dynamic.", type: "success" },
  { agent: "SystemCore", text: "All API bindings responding within threshold buffers.", type: "success" },
  { agent: "DataExtractor", text: "Fetching dynamic indicators from schema standard...", type: "info" }
];

function generateInitialLogs() {
  const consoleElem = document.getElementById('pipeline-logs-console');
  if (!consoleElem) return;
  
  let initialMarkup = "";
  const now = new Date();
  for (let i = 0; i < 15; i++) {
    const logTime = new Date(now.getTime() - (15 - i) * 60000);
    const mock = mockLogs[i % mockLogs.length];
    initialMarkup += makeLogMarkup(logTime, mock.agent, mock.text, mock.type);
  }
  consoleElem.innerHTML = initialMarkup;
}

function makeLogMarkup(time, agent, text, type) {
  const tStr = time.toTimeString().split(' ')[0];
  const typeClass = `log-${type}`;
  return `<div class="mb-1.5"><span class="log-timestamp">[${tStr}]</span> <span class="log-agent">[${agent}]</span> <span class="${typeClass}">${text}</span></div>`;
}

function appendRandomLog() {
  const consoleElem = document.getElementById('pipeline-logs-console');
  if (!consoleElem) return;
  
  const mock = mockLogs[Math.floor(Math.random() * mockLogs.length)];
  consoleElem.innerHTML += makeLogMarkup(new Date(), mock.agent, mock.text, mock.type);
  consoleElem.scrollTop = consoleElem.scrollHeight;
}

function clearPipelineLogs() {
  const consoleElem = document.getElementById('pipeline-logs-console');
  if (consoleElem) consoleElem.innerHTML = `<div class="text-slate-500 font-italic mb-1.5">Console logs cleared. Ready for stream.</div>`;
}

// Step-by-Step Interactive Test Query Execution
function triggerPipelineDemo() {
  const consoleElem = document.getElementById('pipeline-logs-console');
  if (!consoleElem) return;
  
  appendLogImmediate("SystemCore", "User injected new raw analytical test query.", "warning");
  
  // Sequence highlight steps
  let step = 1;
  const interval = setInterval(() => {
    // Reset borders on all cards
    for (let i = 1; i <= 4; i++) {
      document.getElementById(`pipe-step-${i}`).className = "glass-card relative";
    }
    
    if (step > 4) {
      clearInterval(interval);
      appendLogImmediate("SystemCore", "Analytical pipeline evaluation run completed successfully.", "success");
      return;
    }
    
    // Highlight active card
    const activeCard = document.getElementById(`pipe-step-${step}`);
    if (step === 1) {
      activeCard.className = "glass-card border-brand-violet/60 bg-brand-violet/5 shadow-glow-violet relative";
      appendLogImmediate("DataExtractor", "Extracted test query data schema. Initiated JSON conversion...", "info");
    } else if (step === 2) {
      activeCard.className = "glass-card border-brand-cyan/60 bg-brand-cyan/5 shadow-glow-cyan relative";
      appendLogImmediate("SentimentEngine", "Evaluating semantic patterns... Score: +0.87 (High Confidence)", "success");
    } else if (step === 3) {
      activeCard.className = "glass-card border-brand-emerald/60 bg-brand-emerald/5 shadow-glow-emerald relative";
      appendLogImmediate("ForecastingNode", "Running extrapolated predictive weights for target vectors...", "info");
    } else if (step === 4) {
      activeCard.className = "glass-card border-brand-rose/60 bg-brand-rose/5 relative";
      appendLogImmediate("VisualInsights", "Generated multi-axis charts. Render grid loaded.", "success");
    }
    
    step++;
  }, 1500);
}

function appendLogImmediate(agent, text, type) {
  const consoleElem = document.getElementById('pipeline-logs-console');
  if (!consoleElem) return;
  consoleElem.innerHTML += makeLogMarkup(new Date(), agent, text, type);
  consoleElem.scrollTop = consoleElem.scrollHeight;
}

// Settings Toggles & Value Handlers
function updateSettingVal(param, val) {
  document.getElementById(`val-${param}`).innerText = val;
  if (param === 'temp') state.tempSetting = parseFloat(val);
  if (param === 'buffer') state.bufferSetting = parseInt(val);
}

function toggleExtremeGPULoad() {
  const btn = document.getElementById('btn-gpu-extreme');
  if (!btn) return;
  
  state.isExtremeLoad = !state.isExtremeLoad;
  
  if (state.isExtremeLoad) {
    btn.innerText = "Settle Load";
    btn.className = "text-xs bg-brand-rose border border-brand-rose/50 hover:bg-rose-600 px-3 py-1.5 rounded-lg font-bold transition-all text-white glow-active-violet";
    
    state.gpuLoad = 96;
    document.getElementById('load-gpu').innerText = "96% (CRITICAL)";
    document.getElementById('load-gpu').className = "font-bold text-brand-rose";
    document.getElementById('bar-gpu').className = "h-full bg-gradient-to-r from-brand-rose to-red-400 transition-all duration-500";
    document.getElementById('bar-gpu').style.width = "96%";
    
    appendLogImmediate("SystemCore", "CRITICAL WARNING: GPU Memory thresholds exceeding 90% parameters!", "warning");
  } else {
    btn.innerText = "Trigger Load";
    btn.className = "text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg font-bold transition-all text-slate-200";
    
    state.gpuLoad = 48;
    document.getElementById('load-gpu').innerText = "48%";
    document.getElementById('load-gpu').className = "font-semibold text-brand-violet";
    document.getElementById('bar-gpu').className = "h-full bg-gradient-to-r from-brand-violet to-purple-400 transition-all duration-500";
    document.getElementById('bar-gpu').style.width = "48%";
    
    appendLogImmediate("SystemCore", "Core GPU engine temperatures settled back to baseline ranges.", "success");
  }
}

function resetSettings() {
  document.getElementById('param-temp').value = 0.7;
  updateSettingVal('temp', '0.7');
  
  document.getElementById('param-buffer').value = 90;
  updateSettingVal('buffer', '90');
  
  if (state.isExtremeLoad) {
    toggleExtremeGPULoad();
  }
  
  appendLogImmediate("SystemCore", "All Neural pipeline configurations restored to default factory baselines.", "info");
}
