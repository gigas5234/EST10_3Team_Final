import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  'https://nktklwzbbmjhwkvqprfr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdGtsd3piYm1qaHdrdnFwcmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MjgzMTUsImV4cCI6MjA3MDEwNDMxNX0.c8DSvzcVd_j-srTe742pQMSiOorFwso3jPCwgcg6o0s'
)

// 구글 로그인 버튼 이벤트
document.getElementById('google-login').addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })

  if (error) {
    console.error('로그인 에러:', error.message)
    updateStatus('로그인 에러 발생', 'red')
  } else {
    console.log('로그인 시도 중...', data)
  }
})

// 로그인 상태 감지 및 USERS 테이블 저장 로직
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log('로그인 성공 유저 정보:', user)

    if (user) {
      // USERS 테이블에 중복 저장 방지
      const { data: existingUser, error: selectError } = await supabase
        .from('USERS')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existingUser) {
        const { error: insertError } = await supabase.from('USERS').insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || null,
          mbti_code: null,
          mbti_assessed_at: null,
        })

        if (insertError) {
          console.error('USERS 저장 실패:', insertError.message)
          updateStatus('USERS 테이블 저장 실패', 'red')
        } else {
          console.log('USERS 테이블 저장 완료')
          updateStatus(`환영합니다, ${user.user_metadata?.name || '사용자'}님!`, 'green')
        }
      } else {
        console.log('이미 USERS 테이블에 존재함')
        updateStatus(`다시 오셨군요, ${user.user_metadata?.name || '사용자'}님!`, 'green')
      }
    }
  }
})

// 상태 메시지 업데이트 함수
function updateStatus(message, color = 'black') {
  const statusDiv = document.getElementById('status')
  statusDiv.innerText = message
  statusDiv.style.color = color
}
