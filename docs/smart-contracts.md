# Smart Contract Architecture

## Token System (SkateToken.sol)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkateToken is ERC20, Ownable {
    // Daily rewards
    mapping(address => uint256) public lastRewardClaim;
    uint256 public constant DAILY_REWARD = 100 * 10**18; // 100 tokens

    // XP System
    mapping(address => uint256) public userXP;
    mapping(address => uint8) public userRank; // 0: Rookie, 1: Experienced, 2: Legend

    constructor() ERC20("SkateToken", "SKATE") {}

    function claimDailyReward() external {
        require(block.timestamp >= lastRewardClaim[msg.sender] + 1 days, "Already claimed today");
        lastRewardClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, DAILY_REWARD);
    }

    function addXP(address user, uint256 amount) external onlyOwner {
        userXP[user] += amount;
        _updateRank(user);
    }

    function _updateRank(address user) internal {
        if (userXP[user] >= 10000) userRank[user] = 2; // Legend
        else if (userXP[user] >= 5000) userRank[user] = 1; // Experienced
    }
}
```

## Game System (SkateGame.sol)
```solidity
pragma solidity ^0.8.0;

import "./SkateToken.sol";

contract SkateGame {
    SkateToken public token;
    
    struct Game {
        address challenger;
        address opponent;
        uint256 wager;
        bool isComplete;
        address winner;
        uint256 witnessCount;
        mapping(address => bool) witnesses;
    }

    mapping(bytes32 => Game) public games;

    event GameCreated(bytes32 indexed gameId, address challenger, address opponent, uint256 wager);
    event GameComplete(bytes32 indexed gameId, address winner);

    constructor(address _token) {
        token = SkateToken(_token);
    }

    function createGame(address opponent, uint256 wager) external returns (bytes32) {
        require(wager > 0, "Wager must be positive");
        require(token.balanceOf(msg.sender) >= wager, "Insufficient balance");
        
        bytes32 gameId = keccak256(abi.encodePacked(msg.sender, opponent, block.timestamp));
        Game storage game = games[gameId];
        game.challenger = msg.sender;
        game.opponent = opponent;
        game.wager = wager;
        
        token.transferFrom(msg.sender, address(this), wager);
        
        emit GameCreated(gameId, msg.sender, opponent, wager);
        return gameId;
    }

    function attestWinner(bytes32 gameId, address winner) external {
        Game storage game = games[gameId];
        require(!game.isComplete, "Game already complete");
        require(msg.sender == game.challenger || msg.sender == game.opponent || game.witnesses[msg.sender], 
                "Not authorized to attest");
        
        if (winner == game.winner) {
            game.witnessCount++;
            if (game.witnessCount >= 2) {
                _completeGame(gameId);
            }
        }
        game.winner = winner;
    }

    function _completeGame(bytes32 gameId) internal {
        Game storage game = games[gameId];
        game.isComplete = true;
        token.transfer(game.winner, game.wager * 2);
        emit GameComplete(gameId, game.winner);
    }
}
```

## Spot System (SkateSpot.sol)
```solidity
pragma solidity ^0.8.0;

contract SkateSpot {
    struct Spot {
        string name;
        string location;
        uint256 verificationCount;
        mapping(address => bool) verifiers;
        bool isVerified;
        address creator;
    }

    mapping(bytes32 => Spot) public spots;
    mapping(address => bool) public isLegend;

    event SpotCreated(bytes32 indexed spotId, string name, string location);
    event SpotVerified(bytes32 indexed spotId);

    function createSpot(string memory name, string memory location) external returns (bytes32) {
        require(isLegend[msg.sender], "Only legends can create spots");
        
        bytes32 spotId = keccak256(abi.encodePacked(name, location));
        Spot storage spot = spots[spotId];
        spot.name = name;
        spot.location = location;
        spot.creator = msg.sender;
        
        emit SpotCreated(spotId, name, location);
        return spotId;
    }

    function verifySpot(bytes32 spotId) external {
        Spot storage spot = spots[spotId];
        require(!spot.verifiers[msg.sender], "Already verified");
        
        spot.verifiers[msg.sender] = true;
        spot.verificationCount++;
        
        if (spot.verificationCount >= 5) {
            spot.isVerified = true;
            emit SpotVerified(spotId);
        }
    }
}
```