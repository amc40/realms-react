import { useCallback, useEffect, useRef, useState } from "react";
import RealmsSketch from "./sketch/realms-sketch";
import City from "./cities/city";
import { Col, Modal, Row } from "react-bootstrap";
import ResourcesDisplay from "./resources/ResourcesDisplay";
import ProductionItemsDisplay from "./cities/ProductionItemsDisplay";
import BottomLeftDisplay from "./displays/BottomLeftDisplay";
import ResourceProgressDisplay from "./resources/ResourceProgressDisplay";
import Resources, { ResourceQuantity } from "./resources";
import ResourceQuantityDisplay from "./resources/ResourceQuantityDisplay";
import ProductionItemDisplay from "./cities/ProductionItemDisplay";
import CurrentPlayerIndicator from "./assets/CurrentPlayerIndicator/CurrentPlayerIndicator";
import ResourceTransferModal from "./assets/ResourceTransfer/ResourceTransferModal";
import { ResourceTransferSrc } from "./resources/resource-transfer";
import RealmScroller from "./assets/RealmScroller/RealmScroller";
import TileDisplay from "./assets/TileDisplay/TileDisplay";
import HexTile from "./grid/hex-tile";
import styles from "./RealmsGame.module.css";
import EndOfGameModal, {
  EndGameStatus,
} from "./assets/EndOfGame/EndOfGameModal";

type Props = {
  humansOnlyProp: boolean;
  aiOnlyProp: boolean;
  onBack: () => void;
};

const RealmsGame: React.FC<Props> = ({
  aiOnlyProp,
  humansOnlyProp,
  onBack,
}) => {
  const aiOnlyRef = useRef(aiOnlyProp);
  const aiOnly = aiOnlyRef.current;
  const humansOnly = humansOnlyProp;
  const canvasRef = useRef<HTMLDivElement>(null);
  const [realmsSketch, setRealmsSketch] = useState<RealmsSketch | null>(null);

  const [showCityModal, setShowCityModal] = useState(false);
  const [cityModalCity, setCityModalCity] = useState<City | null>(null);

  const [firstResourceTransferQuantity, setFirstResourceTransferQuantity] =
    useState<ResourceQuantity | null>(null);
  const [firstResourceTransferSrcName, setFirstResourceTransferSrcName] =
    useState<string | null>(null);
  const [secondResourceTransferQuantity, setSecondResourceTransferQuantity] =
    useState<ResourceQuantity | null>(null);
  const [secondResourceTransferSrcName, setSecondResourceTransferSrcName] =
    useState<string | null>(null);
  const [onResourceTransferCompleted, setOnResourceTransferCompleted] =
    useState<
      | ((
          firstResourceQuantity: ResourceQuantity,
          secondResourceQuantity: ResourceQuantity
        ) => void)
      | null
    >(null);
  const [showResourceTransferModal, setShowResourceTransferModal] =
    useState(false);

  const [endGameStatus, setEndGameStatus] = useState<
    EndGameStatus | undefined
  >();

  const transferResources = useCallback(
    (
      resourceSrc1: ResourceTransferSrc,
      resourceSrc2: ResourceTransferSrc,
      onCompleted: (
        src1Quantity: ResourceQuantity,
        src2Quantity: ResourceQuantity
      ) => void
    ) => {
      setFirstResourceTransferSrcName(resourceSrc1.resourceSrcName);
      setFirstResourceTransferQuantity(resourceSrc1.resourceSrcQuantity);
      setSecondResourceTransferSrcName(resourceSrc2.resourceSrcName);
      setSecondResourceTransferQuantity(resourceSrc2.resourceSrcQuantity);
      setOnResourceTransferCompleted(() => onCompleted);
      setShowResourceTransferModal(true);
    },
    []
  );

  const openShowCityModal = useCallback(
    (city: City) => {
      setCityModalCity(city);
      setShowCityModal(true);
    },
    [setShowCityModal, setCityModalCity]
  );

  const [hoverHexTile, setHoverHexTile] = useState<HexTile | null>(null);

  const [dummyCount, setDummyCount] = useState(0);

  const rerender = () => {
    setDummyCount((dummyCount) => dummyCount + 1);
  };

  useEffect(() => {
    if (canvasRef.current && !realmsSketch) {
      const canvas = canvasRef.current;
      setRealmsSketch(
        new RealmsSketch(
          canvas,
          aiOnly,
          humansOnly,
          4,
          openShowCityModal,
          rerender,
          transferResources,
          setHoverHexTile,
          (endGameStatus: EndGameStatus) => setEndGameStatus(endGameStatus)
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef.current]);

  const cityModalCityResources = cityModalCity?.getResources();
  const cityModalCurrentProduction = cityModalCity?.getCurrentProduction();
  const cityModalCurrentResourcesPerTurn =
    cityModalCity?.getCurrentResourcesPerTurn();

  return (
    <>
      <div
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        id="canvas"
      />
      {realmsSketch?.currentPlayer != null ? (
        <CurrentPlayerIndicator
          currentPlayer={realmsSketch?.currentPlayer}
          humanPlayer={
            realmsSketch?.humanPlayers.length === 1
              ? realmsSketch?.humanPlayers[0]
              : null
          }
        />
      ) : null}
      <EndOfGameModal status={endGameStatus} onHide={() => onBack()} />
      <Modal
        centered
        show={showCityModal && cityModalCity != null}
        onHide={() => setShowCityModal(false)}
        dialogClassName={styles["city-modal-dialog"]}
      >
        {cityModalCity != null ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{cityModalCity!.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>Resources</h5>
              <ResourcesDisplay
                resources={realmsSketch!.resources!}
                resourceQuantity={cityModalCity!.getTransferrableResources()}
              />
              <h5>Population</h5>
              <ResourceQuantityDisplay
                resourceName="Population"
                resourceIconSrc={Resources.getIconUrl("population")}
                resourceQuantity={cityModalCity!.getResources()!.population!}
              />
              <Row>
                <Col>
                  <ResourceProgressDisplay
                    resourceName="food"
                    resourceColor="#30B700"
                    resourceIconSrc={Resources.getIconUrl("food")}
                    currentQuantity={cityModalCityResources!.food ?? 0}
                    totalQuantity={cityModalCity.getFoodRequiredForPopIncrease()}
                    resourcePerTurn={cityModalCity.getSurplusFood()}
                  />
                </Col>
              </Row>

              <h5>Production</h5>
              <h6>Current Production:</h6>
              {cityModalCurrentProduction != null ? (
                <>
                  <div style={{ marginBottom: 5 }}>
                    <ProductionItemDisplay
                      disabled={false}
                      productionItem={cityModalCurrentProduction}
                      productionPerTurn={
                        cityModalCurrentResourcesPerTurn?.production ?? 0
                      }
                    />
                  </div>

                  <ResourceProgressDisplay
                    resourceName="production"
                    resourceColor="#9e7754"
                    resourceIconSrc={Resources.getIconUrl("production")}
                    currentQuantity={cityModalCityResources!.production ?? 0}
                    totalQuantity={cityModalCurrentProduction.productionCost}
                    resourcePerTurn={
                      cityModalCurrentResourcesPerTurn?.production ?? 0
                    }
                  />
                </>
              ) : (
                "Nothing"
              )}

              <ProductionItemsDisplay
                cityResources={cityModalCity.getResources()}
                onSelect={(productionItem) => {
                  cityModalCity.setCurrentProduction(productionItem);
                  console.log(
                    "set city production to ",
                    productionItem,
                    cityModalCity.getCurrentProduction()
                  );
                  rerender();
                }}
                productionPerTurn={cityModalCity!.getProductionPerTurn()}
                productionItems={realmsSketch!.productionItems!.getItems(
                  realmsSketch?.currentPlayer!
                )}
              />
            </Modal.Body>
          </>
        ) : null}
      </Modal>
      {firstResourceTransferQuantity != null &&
      secondResourceTransferQuantity != null &&
      firstResourceTransferSrcName != null &&
      secondResourceTransferSrcName != null ? (
        <ResourceTransferModal
          show={showResourceTransferModal}
          onHide={(
            firstResourceQuantity: ResourceQuantity,
            secondResourceQuantity: ResourceQuantity
          ) => {
            setFirstResourceTransferQuantity(null);
            setSecondResourceTransferQuantity(null);
            setFirstResourceTransferSrcName(null);
            setSecondResourceTransferSrcName(null);
            setShowResourceTransferModal(false);
            if (onResourceTransferCompleted) {
              onResourceTransferCompleted(
                firstResourceQuantity,
                secondResourceQuantity
              );
            }
            rerender();
          }}
          initialFirstResourceQuantity={firstResourceTransferQuantity}
          initialSecondResourceQuantity={secondResourceTransferQuantity}
          firstResourceSrcName={firstResourceTransferSrcName}
          secondResourceSrcName={secondResourceTransferSrcName}
        />
      ) : null}
      {realmsSketch?.currentMap != null ? (
        <RealmScroller
          currentMap={realmsSketch?.currentMap}
          onLeft={() => {
            if (realmsSketch != null) {
              realmsSketch.nextLeftRealm();
            }
          }}
          onRight={() => {
            if (realmsSketch != null) {
              realmsSketch.nextRightRealm();
            }
          }}
        />
      ) : null}

      {/* <Modal show={showCityModal} onHide={() => setShowCityModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCityModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowCityModal(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}
      {hoverHexTile != null ? (
        <BottomLeftDisplay>
          <TileDisplay hexTile={hoverHexTile} />
        </BottomLeftDisplay>
      ) : null}
    </>
  );
};

export default RealmsGame;
