import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useEffectStart } from '../../hooks/useEffectStart'
import { useAppDispatch } from '../../redux/store'
import { loginFromStore } from '../../redux/user/actions'
import { selectUserInit } from '../../redux/user/selectors'
import DavkaSmluvDetailPage from '../../pages/DavkaSmluvDetailPage/DavkaSmluvDetailPage'
import DavkaSmluvNovaPage from '../../pages/DavkaSmluvNovaPage/DavkaSmluvNovaPage'
import DavkaSmluvPrehledPage from '../../pages/DavkaSmluvPrehledPage/DavkaSmluvPrehledPage'
import HomePage from '../../pages/HomePage/HomePage'
import LoginPage from '../../pages/LoginPage/LoginPage'
import LogyPage from '../../pages/LogyPage/LogyPage'
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage'
import PlatbyPage from '../../pages/PlatbyPage/PlatbyPage'
import SmlouvaDetailPage from '../../pages/SmlouvaDetailPage/SmlouvaDetailPage'
import SmlouvaHistorieDetailPage from '../../pages/SmlouvaHistorieDetailPage/SmlouvaHistorieDetailPage'
import SmlouvaHistoriePage from '../../pages/SmlouvaHistoriePage/SmlouvaHistoriePage'
import SmlouvaNovaPage from '../../pages/SmlouvaNovaPage/SmlouvaNovaPage'
import SmlouvaPrehledPage from '../../pages/SmlouvaPrehledPage/SmlouvaPrehledPage'
import SpravaPage from '../../pages/SpravaPage/SpravaPage'
import SubjektDetailPage from '../../pages/SubjektDetailPage/SubjektDetailPage'
import SubjektNovyPage from '../../pages/SubjektNovyPage/SubjektNovyPage'
import SubjektyDsoPage from '../../pages/SubjektyDsoPage/SubjektyDsoPage'
import SubjektyPage from '../../pages/SubjektyPage/SubjektyPage'
import UzivatelAktivacePage from '../../pages/UzivatelAktivacePage/UzivatelAktivacePage'
import UzivateleDetailPage from '../../pages/UzivateleDetailPage/UzivateleDetailPage'
import UzivateleNovyPage from '../../pages/UzivateleNovyPage/UzivateleNovyPage'
import UzivatelePage from '../../pages/UzivatelePage/UzivatelePage'
import UzivatelProfilPage from '../../pages/UzivatelProfilPage/UzivatelProfilPage'
import UzivatelResetHeslaPage from '../../pages/UzivatelResetHeslaPage/UzivatelResetHeslaPage'
import UzivatelZapomenuteHesloPage from '../../pages/UzivatelZapomenuteHesloPage/UzivatelZapomenuteHesloPage'
import UzivatelZmenaHeslaPage from '../../pages/UzivatelZmenaHeslaPage/UzivatelZmenaHeslaPage'
import Loading from '../Loading/Loading'
import InitDataWrap from './InitDataWrap'
import Layout from './Layout'
import { LINKS } from './LINKS'
import PermissionRoute from './PermissionRoute'
import ProtectedRoute from './ProtectedRoute'
import TestApi from '../../pages/TestApi/TestApi'

// const RedirectTo404 = () => {
//   window.location.href = '/404-not-found?source=' + window.location.pathname
//   return null
// }

function App() {
  const userInit = useSelector(selectUserInit)

  const dispatch = useAppDispatch()

  useEffectStart(() => {
    dispatch(loginFromStore())
  })

  if (!userInit) {
    return <Loading />
  }

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path={LINKS.login} element={<LoginPage />} />

          <Route path={LINKS.resetHesla} element={<UzivatelResetHeslaPage />} />
          <Route path={LINKS.aktivaceUzivatele} element={<UzivatelAktivacePage />} />
          <Route path={LINKS.zapomenuteHeslo} element={<UzivatelZapomenuteHesloPage />} />
          
          {/* Test route to test IDSK API functionality */}
          <Route path={LINKS.home + 'test-api'} element={<TestApi />} />

          <Route
            path={LINKS.home}
            element={
              <ProtectedRoute>
                <InitDataWrap>
                  <Outlet />
                </InitDataWrap>
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />

            <Route path={LINKS.prehledSmluv}>
              <Route index element={<SmlouvaPrehledPage />} />
              <Route
                path={LINKS.novaSmlouva}
                element={
                  <PermissionRoute forReferent>
                    <SmlouvaNovaPage />
                  </PermissionRoute>
                }
              />
              <Route
                path={':id' + LINKS.prehledSmluvHistorie + '/:versionId'}
                element={
                  <PermissionRoute forReferent>
                    <SmlouvaHistorieDetailPage />
                  </PermissionRoute>
                }
              />
              <Route
                path={':id' + LINKS.prehledSmluvHistorie}
                element={
                  <PermissionRoute forReferent>
                    <SmlouvaHistoriePage />
                  </PermissionRoute>
                }
              />
              <Route path={':id'} element={<SmlouvaDetailPage />} />
            </Route>

            <Route
              path={LINKS.prehledDavekSmluv}
              element={
                <PermissionRoute forReferent>
                  <Outlet />
                </PermissionRoute>
              }
            >
              <Route index element={<DavkaSmluvPrehledPage />} />
              <Route path={LINKS.novaDavkaSmluv} element={<DavkaSmluvNovaPage />} />
              <Route path={':id'} element={<DavkaSmluvDetailPage />} />
            </Route>

            <Route
              path={LINKS.platby}
              element={
                <PermissionRoute forReferent>
                  <PlatbyPage />
                </PermissionRoute>
              }
            />

            <Route
              path={LINKS.subjekty}
              element={
                <PermissionRoute forReferent>
                  <Outlet />
                </PermissionRoute>
              }
            >
              <Route index element={<SubjektyPage />} />
              <Route path={LINKS.subjektyDso} element={<SubjektyDsoPage />} />
              <Route path={LINKS.novySubjekt} element={<SubjektNovyPage />} />
              <Route path={':id'} element={<SubjektDetailPage />} />
            </Route>

            <Route
              path={LINKS.sprava}
              element={
                <PermissionRoute forReferent forOrgAdmin>
                  <Outlet />
                </PermissionRoute>
              }
            >
              <Route index element={<SpravaPage />} />
              <Route path={LINKS.uzivatele}>
                <Route index element={<UzivatelePage />} />
                <Route path={LINKS.novyUzivatel} element={<UzivateleNovyPage />} />
                <Route path={':userid'} element={<UzivateleDetailPage />} />
              </Route>
              <Route path={LINKS.spravaLogy}>
                <Route index element={<LogyPage />} />
              </Route>
            </Route>

            <Route path={LINKS.zmenaHesla} element={<UzivatelZmenaHeslaPage />} />
            <Route path={LINKS.profil} element={<UzivatelProfilPage />} />
          </Route>
          <Route path='/404-not-found' element={<NotFoundPage />} />
          <Route
            path='*'
            element={<Navigate to='/404-not-found' replace />}
            // element={<RedirectTo404/>} //TODO hard redirect na 404
          />
        </Route>
      </Routes>
    </>
  )
}

export default App
