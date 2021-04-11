package fr.polytech.info4.service.impl;

import fr.polytech.info4.domain.Panier;
import fr.polytech.info4.repository.PanierRepository;
import fr.polytech.info4.service.PanierService;
import fr.polytech.info4.service.dto.PanierDTO;
import fr.polytech.info4.service.mapper.PanierMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Panier}.
 */
@Service
@Transactional
public class PanierServiceImpl implements PanierService {

    private final Logger log = LoggerFactory.getLogger(PanierServiceImpl.class);

    private final PanierRepository panierRepository;

    private final PanierMapper panierMapper;

    public PanierServiceImpl(PanierRepository panierRepository, PanierMapper panierMapper) {
        this.panierRepository = panierRepository;
        this.panierMapper = panierMapper;
    }

    @Override
    public PanierDTO save(PanierDTO panierDTO) {
        log.debug("Request to save Panier : {}", panierDTO);
        Panier panier = panierMapper.toEntity(panierDTO);
        panier = panierRepository.save(panier);
        return panierMapper.toDto(panier);
    }

    @Override
    public Optional<PanierDTO> partialUpdate(PanierDTO panierDTO) {
        log.debug("Request to partially update Panier : {}", panierDTO);

        return panierRepository
            .findById(panierDTO.getId())
            .map(
                existingPanier -> {
                    panierMapper.partialUpdate(existingPanier, panierDTO);
                    return existingPanier;
                }
            )
            .map(panierRepository::save)
            .map(panierMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PanierDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Paniers");
        return panierRepository.findAll(pageable).map(panierMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PanierDTO> findOne(Long id) {
        log.debug("Request to get Panier : {}", id);
        return panierRepository.findById(id).map(panierMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Panier : {}", id);
        panierRepository.deleteById(id);
    }
}
