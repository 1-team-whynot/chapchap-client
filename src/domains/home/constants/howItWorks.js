export const howItWorks = [
  {
    step: 1,
    icon: 'clipboard',
    title: '조건 입력',
    description: '행사 지역, 날짜, 예상 인원, 메뉴 카테고리, 전기 사용 여부를 입력합니다.',
  },
  {
    step: 2,
    icon: 'search',
    title: '업체 탐색',
    description: '조건에 맞는 밥차와 푸드트럭을 확인합니다.',
  },
  {
    step: 3,
    icon: 'utensils',
    title: '메뉴 확인',
    description: '행사 성격에 맞는 메뉴와 제공 방식을 비교합니다.',
  },
  {
    step: 4,
    icon: 'message',
    title: '견적 요청',
    description: '원하는 업체에 견적을 요청하고 답변을 받습니다.',
  },
  {
    step: 5,
    icon: 'check',
    title: '예약 확정',
    description: '업체와 조건을 확정한 뒤 계약금 결제로 예약합니다.',
  },
  {
    step: 6,
    icon: 'calendarCheck',
    title: '행사 진행',
    description: '행사 당일 서비스를 이용하고 잔금을 정산합니다.',
  },
]

export const stepIconPaths = {
  clipboard: [
    'M8 4h8',
    'M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1Z',
    'M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
    'M8 11h8',
    'M8 15h6',
  ],
  search: [
    'M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z',
    'M16 16l5 5',
  ],
  utensils: [
    'M4 3v7',
    'M8 3v7',
    'M4 7h4',
    'M6 10v11',
    'M17 3c1.8 1.5 3 4 3 7 0 3-1.2 5.5-3 7V3Z',
    'M17 17v4',
  ],
  message: [
    'M5 5h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7l-5 4v-4H5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z',
    'M7 10h10',
    'M7 14h6',
  ],
  check: [
    'M20 6L9 17l-5-5',
    'M12 22a10 10 0 1 1 8.5-15.3',
  ],
  calendarCheck: [
    'M7 2v4',
    'M17 2v4',
    'M4 8h16',
    'M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    'M8 15l2.5 2.5L16 12',
  ],
}
