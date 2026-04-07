import React from 'react';
import { BidEntry } from '../types/game';
import './BidBar.css';

interface Props {
  bids: BidEntry[];
}

const BidBar: React.FC<Props> = ({ bids }) => {
  if (!bids || bids.length === 0) return null;

  const maxBid = 4;
  const winner = bids.reduce((max, b) => (b.bid > max.bid ? b : max), bids[0]);

  return (
    <div className="bid-bar-container">
      <div className="bid-bar-title">🎯 Bidding Round</div>
      <div className="bid-bars">
        {bids.map(b => (
          <div key={b.playerId} className={`bid-player ${b.playerId === winner.playerId ? 'winner' : ''}`}>
            <div className="bid-name">{b.playerName}</div>
            <div className="bid-track">
              <div
                className="bid-fill"
                style={{ width: `${(b.bid / maxBid) * 100}%` }}
              />
              <span className="bid-value">{b.bid}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bid-winner">
        🎤 {winner.playerName} wins the bid (bid: {winner.bid})
      </div>
    </div>
  );
};

export default BidBar;
