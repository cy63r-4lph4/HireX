# HireX 🛠️

HireX is a decentralized hiring platform where **skills speak louder than papers**.  
It allows individuals and communities to build **on-chain reputations**, manage jobs through smart contracts, and get paid transparently.

🚀 Frontend Deployment: [hire-x-nextjs.vercel.app](https://hire-x-nextjs.vercel.app/)

---

## 📜 Smart Contracts

HireX is powered by five core contracts, each handling a different part of the system:

### 1. **Token.sol**

- The native token of the HireX ecosystem (Alph4 Core).
- Used for payments, job escrow, and incentives.
- Can be integrated across other dApps in the 4lph4 verse.

**Deployed Address:**  
`0xb5d8887AB09AdB5983AACEed4e1AbB9267407823`

---

### 2. **Profile.sol**

- Manages user profiles on-chain.
- Stores verifiable identity, work history, and endorsements.
- Acts as the backbone for **reputation scoring**.

**Deployed Address:**  
`0x565A99925AEd5b53F363EBB5BfE268bBD8d414fe`

---

### 3. **ENSManager.sol**

- Handles ENS-style name registrations for HireX.
- Allows users to claim human-readable names linked to their HireX profiles.
- Future support for **cross-L2 ENS integration**.

**Deployed Address:**  
`0x7a58069532202c1bB06CD61A36b470AC89E90fF9`

---

### 4. **JobFactory.sol**

- The main contract to **create and manage job postings**.
- Employers can spin up jobs that workers apply to.
- Links each job to its dedicated escrow contract.

**Deployed Address:**  
`0x36d760E4B1AE55eF86Fd5EB928Fc2DC3C10d8D7a`

---

### 5. **JobEscrow.sol**

- Every task is deployed as its own contract.
- Ensures **secure payments** between hirers and workers.
- Funds are locked until the work is completed and verified.
- Reduces fraud and guarantees fair compensation.

---

## 🌐 Frontend

The frontend is built with **Next.js** and deployed on **Vercel**.

👉 [hire-x-nextjs.vercel.app](https://hire-x-nextjs.vercel.app/)

---

## 🔮 Roadmap

- [ ] Launch MVP with core contracts on testnet.
- [ ] Expand to blue-collar and community-driven hiring.
- [ ] Add premium features (boosted profiles, analytics).
- [ ] Integrate decentralized identity (DID) fully.
- [ ] Mainnet deployment + scaling.

---

## 🤝 Contributing

PRs are welcome! If you’d like to contribute, fork the repo and submit a pull request.

---

## 📄 License

MIT License.
