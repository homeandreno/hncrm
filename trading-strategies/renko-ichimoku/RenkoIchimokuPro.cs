using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Xml.Serialization;
using NinjaTrader.Cbi;
using NinjaTrader.Gui;
using NinjaTrader.Gui.Chart;
using NinjaTrader.Gui.SuperDom;
using NinjaTrader.Gui.Tools;
using NinjaTrader.Data;
using NinjaTrader.NinjaScript;
using NinjaTrader.Core.FloatingPoint;
using NinjaTrader.NinjaScript.Indicators;
using NinjaTrader.NinjaScript.DrawingTools;

namespace NinjaTrader.NinjaScript.Strategies
{
	public class RenkoIchimokuPro : Strategy
	{
		private IchimokuCloud ichimoku;
		private RSI rsi;

		protected override void OnStateChange()
		{
			if (State == State.SetDefaults)
			{
				Description									= @"Professional Renko-Ichimoku Trend System";
				Name										= "RenkoIchimokuPro";
				Calculate									= Calculate.OnBarClose;
				EntriesPerDirection							= 1;
				EntryHandling								= EntryHandling.AllEntries;
				IsExitOnSessionCloseStrategy				= true;
				ExitOnSessionCloseSeconds					= 30;
				IsFillLimitOnTouch							= false;
				MaximumBarsLookBack							= MaximumBarsLookBack.Infinite;
				OrderFillResolution							= OrderFillResolution.Standard;
				Slippage									= 0;
				StartBehavior								= StartBehavior.WaitUntilFlat;
				TimeInForce									= TimeInForce.Gtc;
				TraceOrders									= false;
				RealtimeErrorHandling						= RealtimeErrorHandling.StopCancelClose;
				StopTargetHandling							= StopTargetHandling.PerEntryExecution;
				BarsRequiredToTrade							= 20;
			}
			else if (State == State.DataLoaded)
			{				
				ichimoku = IchimokuCloud(9, 26, 52);
				rsi = RSI(14, 3);
				
				AddChartIndicator(ichimoku);
				AddChartIndicator(rsi);
			}
		}

		protected override void OnBarUpdate()
		{
			if (CurrentBar < BarsRequiredToTrade) return;

			// LOGIC: Above Cloud + Green Renko Bar + RSI Trend Up
			bool isAboveCloud = Close[0] > ichimoku.SenkouSpanA[0] && Close[0] > ichimoku.SenkouSpanB[0];
			bool isBelowCloud = Close[0] < ichimoku.SenkouSpanA[0] && Close[0] < ichimoku.SenkouSpanB[0];
			
			// BUY SIGNAL
			if (isAboveCloud && Close[0] > Open[0] && rsi[0] > 50)
			{
				EnterLong("RenkoBuy");
			}
			
			// SELL SIGNAL
			if (isBelowCloud && Close[0] < Open[0] && rsi[0] < 50)
			{
				EnterShort("RenkoSell");
			}
		}
	}
}
