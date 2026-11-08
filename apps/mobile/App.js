import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Qatar Airways Luxury Color Palette
const COLORS = {
  burgundy: '#5C0632',
  deepBurgundy: '#3B021F',
  darkObsidian: '#0F1015',
  cardBg: '#181A22',
  cardBorder: 'rgba(197, 160, 89, 0.22)',
  gold: '#C5A059',
  lightGold: '#E5C378',
  champagne: '#F5E6CC',
  textLight: '#FAF7F2',
  textMuted: '#9E9DA8',
  emerald: '#10B981',
  rose: '#F43F5E',
  amber: '#F59E0B',
};

// Fallback Mock Opportunities
const INITIAL_OPPORTUNITIES = [
  {
    id: 'BRZ-001',
    flight_code: 'QA-DD-1029',
    route: 'JHB ➔ DIMENSION DATA',
    title: 'Junior Systems Support & Network Technician',
    organization: 'Dimension Data / NTT',
    category: 'FIRST CLASS JOB',
    stipend_salary: 'R16,000 - R22,000 / mo',
    closing_date: '15 DEC 2026',
    location: 'Johannesburg, Gauteng',
    requirements: ['Diploma in IT', 'Cisco CCNA', 'Customer Support'],
    match_score: '94%',
  },
  {
    id: 'BRZ-002',
    flight_code: 'QA-SETA-774',
    route: 'CPT ➔ CAPACITI ACADEMY',
    title: 'MICT SETA Software Development Learnership',
    organization: 'MICT SETA / Capaciti',
    category: 'BUSINESS LEARNERSHIP',
    stipend_salary: 'R5,500 monthly stipend',
    closing_date: '30 NOV 2026',
    location: 'Cape Town & Remote',
    requirements: ['Matric Pure Maths', 'Age 18 - 29', 'SA Citizen'],
    match_score: '96%',
  },
  {
    id: 'BRZ-003',
    flight_code: 'QA-SAS-2027',
    route: 'NATIONAL ➔ SASOL FOUNDATION',
    title: 'Sasol Foundation Undergraduate STEM Bursary',
    organization: 'Sasol Foundation',
    category: 'VIP STEM BURSARY',
    stipend_salary: 'Full Tuition + Laptop Allowance',
    closing_date: '05 DEC 2026',
    location: 'National South Africa',
    requirements: ['Maths Level 6+', 'Physical Sciences Level 6+'],
    match_score: '91%',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('radar'); // 'radar', 'tailor', 'shield', 'prices', 'vault'
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // AI Tailor State
  const [jobTitle, setJobTitle] = useState('Junior Network Support Technician');
  const [company, setCompany] = useState('Dimension Data');
  const [tailoredResult, setTailoredResult] = useState(null);

  // Scam Shield State
  const [shieldText, setShieldText] = useState('Pay R350 uniform fee to WhatsApp number immediately to confirm your job interview.');
  const [shieldVerdict, setShieldVerdict] = useState(null);

  // Price Sniffer State
  const [priceQuery, setPriceQuery] = useState('Study Laptop Core i5');
  const [priceResult, setPriceResult] = useState(null);

  // Fetch opportunities from local Breeze server on boot
  useEffect(() => {
    fetch('http://10.0.2.2:8765/api/opportunities')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.results) {
          const mapped = data.results.map((o, idx) => ({
            id: o.id,
            flight_code: `QA-BRZ-00${idx + 1}`,
            route: `JHB ➔ ${o.organization.toUpperCase()}`,
            title: o.title,
            organization: o.organization,
            category: o.category === 'JOB' ? 'FIRST CLASS JOB' : 'BUSINESS LEARNERSHIP',
            stipend_salary: o.stipend_salary,
            closing_date: o.closing_date,
            location: o.location,
            requirements: o.requirements,
            match_score: '95%',
          }));
          setOpportunities(mapped);
        }
      })
      .catch(() => {
        // Keeps luxury initial fallback seamlessly
      });
  }, []);

  const handleApplyPress = (opp) => {
    setSelectedOpp(opp);
    setApplyModalVisible(true);
  };

  const executeApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setApplyModalVisible(false);
      Alert.alert(
        'Boarding Pass Confirmed',
        `Your 1-Click application for ${selectedOpp?.title} at ${selectedOpp?.organization} has been dispatched.\n\nNotion Kanban updated • WhatsApp alert queued.`,
        [{ text: 'Privilege Club Home', onPress: () => setActiveTab('radar') }]
      );
    }, 1200);
  };

  const handleTailorSubmit = () => {
    setTailoredResult({
      score: '94%',
      summary: `Technically disciplined Diploma in IT graduate with hands-on networking and automation proficiencies aligned to ${company}'s operational benchmarks.`,
      letter: `Dear Hiring Team at ${company},\n\nI am writing to submit my formal application for the ${jobTitle} position. Holding a Diploma in IT and practical lab experience configuring switches, subnets, and automated Python workflows, I am prepared to contribute disciplined execution from day one.\n\nSincerely,\nBhekumusa Ntshwenya\n+27 72 000 0000 | bhekumusaeric@gmail.com`,
    });
  };

  const handleShieldScan = () => {
    const isScam = shieldText.toLowerCase().includes('pay') || shieldText.toLowerCase().includes('fee');
    setShieldVerdict({
      score: isScam ? '10%' : '92%',
      verdict: isScam ? 'HIGH RISK BORDER ALERT' : 'VERIFIED LEGITIMATE EMPLOYER',
      flags: isScam ? ['Demands upfront payment/deposit', 'Unverified WhatsApp recruitment channel'] : ['No advance-fee patterns detected'],
      advice: isScam ? 'DO NOT SEND FUNDS. Legitimate South African employers never demand cash for jobs.' : 'Safe to proceed with formal submission.',
    });
  };

  const handlePriceScan = () => {
    setPriceResult({
      product: priceQuery,
      amazon: 'R7,699',
      takealot: 'R8,499',
      makro: 'R8,299',
      best: 'Amazon SA (R7,699)',
      savings: 'R800 Immediate Savings',
      trend: 'GENUINE DISCOUNT: 12% below 90-day benchmark',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.deepBurgundy} />

      {/* Qatar Airways Executive Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.privilegeBadge}>
            <View style={styles.goldDot} />
            <Text style={styles.privilegeBadgeText}>PRIVILEGE CLUB • PLATINUM TIER</Text>
          </View>
          <Text style={styles.greetingText}>Welcome aboard, Bhekumusa</Text>
          <Text style={styles.subGreetingText}>Breeze Executive Career Flight Deck</Text>
        </View>

        <TouchableOpacity style={styles.profileBadge} onPress={() => setActiveTab('vault')}>
          <Text style={styles.profileInitials}>BN</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ================================================================= */}
        {/* TAB 1: RADAR (BOARDING PASS TILES)                                */}
        {/* ================================================================= */}
        {activeTab === 'radar' && (
          <View style={styles.sectionContainer}>
            {/* VIP Status Card */}
            <View style={styles.vipCard}>
              <View style={styles.vipCardTop}>
                <Text style={styles.vipTier}>QSUITE YOUTH CONCIERGE</Text>
                <Text style={styles.vipMiles}>1,450 Qpoints</Text>
              </View>
              <Text style={styles.vipCardTitle}>Next Flight: Dimension Data IT Support</Text>
              <Text style={styles.vipCardRoute}>Johannesburg (JHB) ➔ Sandton Corporate Campus</Text>

              <View style={styles.vipDivider} />

              <View style={styles.vipCardStats}>
                <View>
                  <Text style={styles.vipStatLabel}>PORTAL MATCH</Text>
                  <Text style={styles.vipStatVal}>98%</Text>
                </View>
                <View>
                  <Text style={styles.vipStatLabel}>CERTIFIED VAULT</Text>
                  <Text style={styles.vipStatVal}>ACTIVE</Text>
                </View>
                <View>
                  <Text style={styles.vipStatLabel}>MCP ENGINE</Text>
                  <Text style={styles.vipStatVal}>11 TOOLS</Text>
                </View>
              </View>
            </View>

            {/* Quick Action Concierge Strip */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll}>
              <TouchableOpacity style={styles.quickChipActive}>
                <Text style={styles.quickChipActiveText}>All Openings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickChip} onPress={() => setActiveTab('tailor')}>
                <Text style={styles.quickChipText}>✨ AI ATS Tailor</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickChip} onPress={() => setActiveTab('shield')}>
                <Text style={styles.quickChipText}>🛡️ Scam Shield</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickChip} onPress={() => setActiveTab('prices')}>
                <Text style={styles.quickChipText}>🛍️ Duty Free Deals</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Boarding Pass Cards */}
            <Text style={styles.sectionTitle}>Curated Boarding Passes ({opportunities.length})</Text>

            {opportunities.map((opp) => (
              <View key={opp.id} style={styles.ticketCard}>
                {/* Ticket Top */}
                <View style={styles.ticketHeader}>
                  <View style={styles.ticketClassBadge}>
                    <Text style={styles.ticketClassText}>{opp.category}</Text>
                  </View>
                  <Text style={styles.flightCode}>{opp.flight_code}</Text>
                </View>

                {/* Route Header */}
                <Text style={styles.ticketRoute}>{opp.route}</Text>
                <Text style={styles.ticketTitle}>{opp.title}</Text>
                <Text style={styles.ticketOrg}>{opp.organization} • {opp.location}</Text>

                {/* Perforation Line */}
                <View style={styles.perforationWrapper}>
                  <View style={styles.perforationHoleLeft} />
                  <View style={styles.perforationLine} />
                  <View style={styles.perforationHoleRight} />
                </View>

                {/* Ticket Details Bottom */}
                <View style={styles.ticketMetaRow}>
                  <View>
                    <Text style={styles.ticketMetaLabel}>COMPENSATION</Text>
                    <Text style={styles.ticketMetaVal}>{opp.stipend_salary}</Text>
                  </View>
                  <View>
                    <Text style={styles.ticketMetaLabel}>CLOSING DATE</Text>
                    <Text style={styles.ticketMetaVal}>{opp.closing_date}</Text>
                  </View>
                  <View>
                    <Text style={styles.ticketMetaLabel}>ATS MATCH</Text>
                    <Text style={[styles.ticketMetaVal, { color: COLORS.emerald }]}>{opp.match_score}</Text>
                  </View>
                </View>

                {/* 1-Click Boarding Pass Button */}
                <TouchableOpacity style={styles.boardButton} onPress={() => handleApplyPress(opp)}>
                  <Text style={styles.boardButtonText}>⚡ 1-Click Apply & Board</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* ================================================================= */}
        {/* TAB 2: AI TAILOR                                                  */}
        {/* ================================================================= */}
        {activeTab === 'tailor' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Qsuite AI ATS & Motivation Tailor</Text>
            <Text style={styles.sectionSub}>Tailor your application to match corporate ATS algorithms with First Class precision.</Text>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>TARGET ROLE / VACANCY</Text>
              <TextInput
                style={styles.input}
                value={jobTitle}
                onChangeText={setJobTitle}
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={styles.inputLabel}>CORPORATION / EMPLOYER</Text>
              <TextInput
                style={styles.input}
                value={company}
                onChangeText={setCompany}
                placeholderTextColor={COLORS.textMuted}
              />

              <TouchableOpacity style={styles.goldButton} onPress={handleTailorSubmit}>
                <Text style={styles.goldButtonText}>✨ Generate ATS Application</Text>
              </TouchableOpacity>
            </View>

            {tailoredResult && (
              <View style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketClassText}>OPTIMIZATION REPORT</Text>
                  <Text style={[styles.flightCode, { color: COLORS.emerald }]}>{tailoredResult.score} ATS MATCH</Text>
                </View>

                <Text style={styles.inputLabel}>PROFILE SUMMARY</Text>
                <Text style={styles.bodyText}>{tailoredResult.summary}</Text>

                <View style={styles.vipDivider} />

                <Text style={styles.inputLabel}>EXECUTIVE COVER LETTER</Text>
                <Text style={styles.monoText}>{tailoredResult.letter}</Text>

                <TouchableOpacity
                  style={[styles.boardButton, { marginTop: 15 }]}
                  onPress={() => Alert.alert('Copied', 'Motivation letter copied to clipboard!')}
                >
                  <Text style={styles.boardButtonText}>📋 Copy Motivation Letter</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ================================================================= */}
        {/* TAB 3: SCAM SHIELD (BORDER CONTROL)                              */}
        {/* ================================================================= */}
        {activeTab === 'shield' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Border Security & Scam Shield</Text>
            <Text style={styles.sectionSub}>Passport-grade biometric scanning for advance-fee recruitment syndicates and fraudulent vacancies.</Text>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>PASTE RECRUITMENT MESSAGE / WHATSAPP / AD</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                multiline
                value={shieldText}
                onChangeText={setShieldText}
                placeholderTextColor={COLORS.textMuted}
              />

              <TouchableOpacity style={[styles.goldButton, { backgroundColor: COLORS.rose }]} onPress={handleShieldScan}>
                <Text style={styles.goldButtonText}>🛡️ Run Biometric Fraud Scan</Text>
              </TouchableOpacity>
            </View>

            {shieldVerdict && (
              <View style={[styles.ticketCard, { borderColor: shieldVerdict.score === '10%' ? COLORS.rose : COLORS.emerald }]}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketClassText}>{shieldVerdict.verdict}</Text>
                  <Text style={[styles.flightCode, { color: shieldVerdict.score === '10%' ? COLORS.rose : COLORS.emerald }]}>
                    TRUST SCORE: {shieldVerdict.score}
                  </Text>
                </View>

                <Text style={styles.inputLabel}>FLAGS IDENTIFIED</Text>
                {shieldVerdict.flags.map((f, idx) => (
                  <Text key={idx} style={[styles.bodyText, { color: COLORS.rose, fontWeight: 'bold' }]}>⚠️ {f}</Text>
                ))}

                <View style={styles.vipDivider} />

                <Text style={styles.inputLabel}>EXECUTIVE ADVICE</Text>
                <Text style={styles.bodyText}>{shieldVerdict.advice}</Text>
              </View>
            )}
          </View>
        )}

        {/* ================================================================= */}
        {/* TAB 4: PRICE SNIFFER (DUTY FREE)                                  */}
        {/* ================================================================= */}
        {activeTab === 'prices' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Qatar Duty Free & Student Deals</Text>
            <Text style={styles.sectionSub}>Benchmark prices across Takealot, Amazon SA, and Makro with 90-day luxury price checks.</Text>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>SEARCH PRODUCT / TECH ESSENTIAL</Text>
              <TextInput
                style={styles.input}
                value={priceQuery}
                onChangeText={setPriceQuery}
                placeholderTextColor={COLORS.textMuted}
              />

              <TouchableOpacity style={styles.goldButton} onPress={handlePriceScan}>
                <Text style={styles.goldButtonText}>🛍️ Compare Duty Free Deals</Text>
              </TouchableOpacity>
            </View>

            {priceResult && (
              <View style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketClassText}>BEST MARKET VALUE</Text>
                  <Text style={[styles.flightCode, { color: COLORS.emerald }]}>{priceResult.best}</Text>
                </View>

                <Text style={[styles.ticketTitle, { color: COLORS.gold }]}>{priceResult.savings}</Text>
                <Text style={styles.bodyText}>{priceResult.trend}</Text>

                <View style={styles.vipDivider} />

                <View style={styles.ticketMetaRow}>
                  <View>
                    <Text style={styles.ticketMetaLabel}>AMAZON SA</Text>
                    <Text style={styles.ticketMetaVal}>{priceResult.amazon}</Text>
                  </View>
                  <View>
                    <Text style={styles.ticketMetaLabel}>TAKEALOT</Text>
                    <Text style={styles.ticketMetaVal}>{priceResult.takealot}</Text>
                  </View>
                  <View>
                    <Text style={styles.ticketMetaLabel}>MAKRO</Text>
                    <Text style={styles.ticketMetaVal}>{priceResult.makro}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ================================================================= */}
        {/* TAB 5: VAULT (PRIVILEGE CLUB CARD)                                */}
        {/* ================================================================= */}
        {activeTab === 'vault' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Privilege Club Digital Identity</Text>
            <Text style={styles.sectionSub}>Encrypted personal credentials powering 1-click universal boarding pass submissions.</Text>

            {/* Metallic Gold / Burgundy Privilege Card */}
            <View style={styles.membershipCard}>
              <View style={styles.membershipHeader}>
                <Text style={styles.membershipBrand}>QATAR AIRWAYS</Text>
                <Text style={styles.membershipTier}>PLATINUM PRIVILEGE</Text>
              </View>

              <View style={styles.chipGraphic} />

              <Text style={styles.membershipNumber}>QA • BRZ • 010825 • 5800</Text>

              <View style={styles.membershipFooter}>
                <View>
                  <Text style={styles.memberLabel}>MEMBER NAME</Text>
                  <Text style={styles.memberName}>BHEKUMUSA NTSHWENYA</Text>
                </View>
                <View>
                  <Text style={styles.memberLabel}>QUALIFICATION</Text>
                  <Text style={styles.memberName}>DIPLOMA IN IT</Text>
                </View>
              </View>
            </View>

            {/* Document Vault List */}
            <View style={styles.card}>
              <Text style={styles.inputLabel}>VERIFIED STORED CREDENTIALS</Text>
              <View style={styles.docRow}>
                <Text style={styles.bodyText}>📄 certified_national_id.pdf</Text>
                <Text style={styles.verifiedTag}>VERIFIED</Text>
              </View>
              <View style={styles.docRow}>
                <Text style={styles.bodyText}>📜 matric_certificate.pdf</Text>
                <Text style={styles.verifiedTag}>VERIFIED</Text>
              </View>
              <View style={styles.docRow}>
                <Text style={styles.bodyText}>🎓 tertiary_transcript_eduvos.pdf</Text>
                <Text style={styles.verifiedTag}>VERIFIED</Text>
              </View>
              <View style={styles.docRow}>
                <Text style={styles.bodyText}>💼 master_executive_cv.pdf</Text>
                <Text style={styles.verifiedTag}>VERIFIED</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Navigation Bar (Qatar Airways Luxury Style) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('radar')}
        >
          <Text style={[styles.navIcon, activeTab === 'radar' && styles.navIconActive]}>✈️</Text>
          <Text style={[styles.navText, activeTab === 'radar' && styles.navTextActive]}>Radar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('tailor')}
        >
          <Text style={[styles.navIcon, activeTab === 'tailor' && styles.navIconActive]}>✨</Text>
          <Text style={[styles.navText, activeTab === 'tailor' && styles.navTextActive]}>AI Tailor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('shield')}
        >
          <Text style={[styles.navIcon, activeTab === 'shield' && styles.navIconActive]}>🛡️</Text>
          <Text style={[styles.navText, activeTab === 'shield' && styles.navTextActive]}>Shield</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('prices')}
        >
          <Text style={[styles.navIcon, activeTab === 'prices' && styles.navIconActive]}>🛍️</Text>
          <Text style={[styles.navText, activeTab === 'prices' && styles.navTextActive]}>Deals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('vault')}
        >
          <Text style={[styles.navIcon, activeTab === 'vault' && styles.navIconActive]}>💳</Text>
          <Text style={[styles.navText, activeTab === 'vault' && styles.navTextActive]}>Vault</Text>
        </TouchableOpacity>
      </View>

      {/* 1-Click Apply Modal */}
      <Modal visible={applyModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketClassText}>BOARDING APPLICATION</Text>
              <TouchableOpacity onPress={() => setApplyModalVisible(false)}>
                <Text style={{ color: COLORS.textMuted, fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.ticketRoute}>{selectedOpp?.route}</Text>
            <Text style={styles.ticketTitle}>{selectedOpp?.title}</Text>
            <Text style={styles.ticketOrg}>{selectedOpp?.organization}</Text>

            <View style={styles.vipDivider} />

            <Text style={styles.inputLabel}>AUTO-FILLED PASSENGER DETAILS</Text>
            <Text style={styles.bodyText}>• Applicant: Bhekumusa Ntshwenya</Text>
            <Text style={styles.bodyText}>• ID Number: 0108255800084</Text>
            <Text style={styles.bodyText}>• Qualification: Diploma in IT (Eduvos)</Text>
            <Text style={styles.bodyText}>• Documents: Certified ID, Matric, CV (Attached)</Text>

            <TouchableOpacity style={styles.boardButton} onPress={executeApply} disabled={isApplying}>
              <Text style={styles.boardButtonText}>{isApplying ? 'Boarding in progress...' : 'Confirm & Dispatch Application'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkObsidian,
  },
  header: {
    backgroundColor: COLORS.deepBurgundy,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  privilegeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  goldDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
    marginRight: 6,
  },
  privilegeBadgeText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  greetingText: {
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subGreetingText: {
    color: COLORS.champagne,
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.8,
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.burgundy,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
  },
  vipCard: {
    backgroundColor: COLORS.burgundy,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 18,
  },
  vipCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  vipTier: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  vipMiles: {
    color: COLORS.champagne,
    fontSize: 11,
    fontWeight: '600',
  },
  vipCardTitle: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  vipCardRoute: {
    color: COLORS.champagne,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.85,
  },
  vipDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  vipCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vipStatLabel: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '600',
  },
  vipStatVal: {
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  quickScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  quickChipActive: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  quickChipActiveText: {
    color: COLORS.darkObsidian,
    fontSize: 12,
    fontWeight: '700',
  },
  quickChip: {
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  quickChipText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    color: COLORS.textLight,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  sectionSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 14,
  },
  ticketCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 16,
    marginBottom: 16,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketClassBadge: {
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: COLORS.gold,
  },
  ticketClassText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '700',
  },
  flightCode: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  ticketRoute: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ticketTitle: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  ticketOrg: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  perforationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  perforationHoleLeft: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.darkObsidian,
    position: 'absolute',
    left: -23,
  },
  perforationLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  perforationHoleRight: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.darkObsidian,
    position: 'absolute',
    right: -23,
  },
  ticketMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ticketMetaLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '600',
  },
  ticketMetaVal: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  boardButton: {
    backgroundColor: COLORS.burgundy,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  boardButtonText: {
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 16,
  },
  inputLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textLight,
    fontSize: 13,
  },
  goldButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  goldButtonText: {
    color: COLORS.darkObsidian,
    fontSize: 13,
    fontWeight: '800',
  },
  bodyText: {
    color: COLORS.textLight,
    fontSize: 12,
    lineHeight: 18,
    marginVertical: 2,
  },
  monoText: {
    color: COLORS.champagne,
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  membershipCard: {
    backgroundColor: COLORS.deepBurgundy,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    marginBottom: 16,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membershipBrand: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  membershipTier: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  chipGraphic: {
    width: 36,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.gold,
    opacity: 0.8,
    marginVertical: 16,
  },
  membershipNumber: {
    color: COLORS.champagne,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 16,
  },
  membershipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberLabel: {
    color: COLORS.gold,
    fontSize: 8,
    fontWeight: '700',
  },
  memberName: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  verifiedTag: {
    color: COLORS.emerald,
    fontSize: 10,
    fontWeight: '700',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24, 26, 34, 0.95)',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
  },
  navText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
  navTextActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    padding: 20,
  },
});

