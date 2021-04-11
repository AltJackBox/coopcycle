package fr.polytech.info4.service.impl;

import fr.polytech.info4.domain.Compte;
import fr.polytech.info4.repository.CompteRepository;
import fr.polytech.info4.service.CompteService;
import fr.polytech.info4.service.dto.CompteDTO;
import fr.polytech.info4.service.mapper.CompteMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Compte}.
 */
@Service
@Transactional
public class CompteServiceImpl implements CompteService {

    private final Logger log = LoggerFactory.getLogger(CompteServiceImpl.class);

    private final CompteRepository compteRepository;

    private final CompteMapper compteMapper;

    public CompteServiceImpl(CompteRepository compteRepository, CompteMapper compteMapper) {
        this.compteRepository = compteRepository;
        this.compteMapper = compteMapper;
    }

    @Override
    public CompteDTO save(CompteDTO compteDTO) {
        log.debug("Request to save Compte : {}", compteDTO);
        Compte compte = compteMapper.toEntity(compteDTO);
        compte = compteRepository.save(compte);
        return compteMapper.toDto(compte);
    }

    @Override
    public Optional<CompteDTO> partialUpdate(CompteDTO compteDTO) {
        log.debug("Request to partially update Compte : {}", compteDTO);

        return compteRepository
            .findById(compteDTO.getId())
            .map(
                existingCompte -> {
                    compteMapper.partialUpdate(existingCompte, compteDTO);
                    return existingCompte;
                }
            )
            .map(compteRepository::save)
            .map(compteMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompteDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Comptes");
        return compteRepository.findAll(pageable).map(compteMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CompteDTO> findOne(Long id) {
        log.debug("Request to get Compte : {}", id);
        return compteRepository.findById(id).map(compteMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Compte : {}", id);
        compteRepository.deleteById(id);
    }
}
